// Utility functions for parsing CCCD QR code data
export interface CCCDQRData {
  id: string;           // Số căn cước công dân
  name: string;         // Họ và tên
  dob: string;          // Ngày sinh (DD/MM/YYYY)
  gender: string;       // Giới tính
  nationality: string;  // Quốc tịch
  address: string;      // Địa chỉ thường trú
  placeOfOrigin: string; // Quê quán
  issuingAuthority: string; // Cơ quan cấp
  issueDate: string;    // Ngày cấp
  expiryDate?: string;  // Ngày hết hạn (nếu có)
  ethnicity?: string;   // Dân tộc
  religion?: string;    // Tôn giáo
}

export interface ParseResult {
  success: boolean;
  data?: CCCDQRData;
  error?: string;
}

/**
 * Parse CCCD QR code data from string
 * CCCD QR code format varies, this handles common Vietnamese CCCD formats
 */
export function parseCCCDQR(qrData: string): ParseResult {
  try {
    // Remove any whitespace and normalize
    const cleanData = qrData.trim().replace(/\s+/g, ' ');
    
    // Try to parse as JSON first (some CCCD QR codes are JSON format)
    try {
      const jsonData = JSON.parse(cleanData);
      return parseJSONFormat(jsonData);
    } catch {
      // If not JSON, try to parse as structured text
      return parseTextFormat(cleanData);
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to parse CCCD QR data: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Parse JSON format CCCD QR data
 */
function parseJSONFormat(data: any): ParseResult {
  try {
    // Common JSON formats for CCCD QR codes
    const cccdData: CCCDQRData = {
      id: data.id || data.idNumber || data.so_cccd || '',
      name: data.name || data.fullName || data.ho_ten || '',
      dob: data.dob || data.dateOfBirth || data.ngay_sinh || '',
      gender: data.gender || data.gioi_tinh || '',
      nationality: data.nationality || data.quoc_tich || 'Việt Nam',
      address: data.address || data.dia_chi || data.dia_chi_thuong_tru || '',
      placeOfOrigin: data.placeOfOrigin || data.que_quan || '',
      issuingAuthority: data.issuingAuthority || data.co_quan_cap || 'Công an tỉnh/thành phố',
      issueDate: data.issueDate || data.ngay_cap || '',
      expiryDate: data.expiryDate || data.ngay_het_han || '',
      ethnicity: data.ethnicity || data.dan_toc || '',
      religion: data.religion || data.ton_giao || ''
    };

    // Validate required fields
    if (!cccdData.id || !cccdData.name || !cccdData.dob) {
      return {
        success: false,
        error: 'Missing required fields in CCCD data'
      };
    }

    return {
      success: true,
      data: cccdData
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to parse JSON CCCD data: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Parse text format CCCD QR data
 * This handles various text formats that might be used in CCCD QR codes
 */
function parseTextFormat(text: string): ParseResult {
  try {
    // Split by common delimiters
    const lines = text.split(/[\n\r,;|]/).map(line => line.trim()).filter(line => line.length > 0);
    
    const cccdData: Partial<CCCDQRData> = {};
    
    // Parse each line looking for patterns
    for (const line of lines) {
      // ID number pattern
      if (/^\d{9,12}$/.test(line)) {
        cccdData.id = line;
      }
      // Name pattern (contains Vietnamese characters)
      else if (/^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+$/i.test(line) && line.length > 5) {
        if (!cccdData.name) {
          cccdData.name = line.toUpperCase();
        }
      }
      // Date pattern (DD/MM/YYYY)
      else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(line)) {
        if (!cccdData.dob) {
          cccdData.dob = line;
        } else if (!cccdData.issueDate) {
          cccdData.issueDate = line;
        }
      }
      // Gender pattern
      else if (/^(Nam|Nữ|Male|Female)$/i.test(line)) {
        cccdData.gender = line;
      }
      // Address pattern (contains "phường", "xã", "quận", "huyện", "tỉnh", "thành phố")
      else if (/phường|xã|quận|huyện|tỉnh|thành phố|street|ward|district|province/i.test(line)) {
        if (!cccdData.address) {
          cccdData.address = line;
        } else if (!cccdData.placeOfOrigin) {
          cccdData.placeOfOrigin = line;
        }
      }
    }

    // Validate required fields
    if (!cccdData.id || !cccdData.name || !cccdData.dob) {
      return {
        success: false,
        error: 'Could not extract required information from CCCD QR code'
      };
    }

    // Set defaults for missing fields
    const result: CCCDQRData = {
      id: cccdData.id,
      name: cccdData.name,
      dob: cccdData.dob,
      gender: cccdData.gender || '',
      nationality: cccdData.nationality || 'Việt Nam',
      address: cccdData.address || '',
      placeOfOrigin: cccdData.placeOfOrigin || '',
      issuingAuthority: cccdData.issuingAuthority || 'Công an tỉnh/thành phố',
      issueDate: cccdData.issueDate || '',
      expiryDate: cccdData.expiryDate || '',
      ethnicity: cccdData.ethnicity || '',
      religion: cccdData.religion || ''
    };

    return {
      success: true,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to parse text CCCD data: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Validate CCCD QR data
 */
export function validateCCCDData(data: CCCDQRData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate ID number (9-12 digits)
  if (!data.id || !/^\d{9,12}$/.test(data.id)) {
    errors.push('Số CCCD không hợp lệ (phải có 9-12 chữ số)');
  }

  // Validate name
  if (!data.name || data.name.length < 2) {
    errors.push('Họ tên không hợp lệ');
  }

  // Validate date of birth
  if (!data.dob || !/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(data.dob)) {
    errors.push('Ngày sinh không hợp lệ (định dạng DD/MM/YYYY)');
  }

  // Validate gender
  if (data.gender && !/^(Nam|Nữ|Male|Female)$/i.test(data.gender)) {
    errors.push('Giới tính không hợp lệ');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Convert CCCD data to registration form data
 */
export function cccdToRegistrationData(cccdData: CCCDQRData): {
  name: string;
  email: string;
  phone: string;
  address: string;
} {
  return {
    name: cccdData.name,
    email: '', // Email is not available in CCCD
    phone: '', // Phone is not available in CCCD
    address: cccdData.address
  };
}

/**
 * Format date from DD/MM/YYYY to ISO string
 */
export function formatDateToISO(dateString: string): string {
  try {
    const [day, month, year] = dateString.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toISOString();
  } catch {
    return '';
  }
}
