/**
 * Custom hook for Schools & Green Courses
 * Handles schools and educational data fetching
 */

import { useState, useEffect, useCallback } from 'react';
import { schoolService } from '../services';
import type {
  School,
  GreenCourse,
  SchoolParams,
  NearbySchoolParams,
  GreenCourseParams,
} from '../types/api';

// ============================================================================
// SCHOOLS HOOKS
// ============================================================================

export const useSchools = (params?: SchoolParams) => {
  const [data, setData] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // API trả về array trực tiếp
      const result = await schoolService.getSchools(params);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách trường học');
      console.error('Fetch schools error:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [params?.skip, params?.limit, params?.district, params?.city, params?.school_type]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, total: data.length, loading, error, refetch: fetchData };
};

export const useNearbySchools = (params: NearbySchoolParams | null) => {
  const [data, setData] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!params) return;

    try {
      setLoading(true);
      setError(null);
      console.log('🔄 [useNearbySchools] Fetching nearby schools:', params);
      const result = await schoolService.getNearbySchools(params);
      console.log('✅ [useNearbySchools] Found', result.length, 'schools');
      console.log('🏫 [useNearbySchools] Schools:', result.map(s => ({
        name: s.name,
        distance: s.distance,
        district: s.district
      })));
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Không thể tìm trường học gần đây');
      console.error('❌ [useNearbySchools] Error:', err);
    } finally {
      setLoading(false);
    }
  }, [params?.latitude, params?.longitude, params?.radius, params?.limit]);

  useEffect(() => {
    if (params) {
      fetchData();
    }
  }, [fetchData]); // Fixed: removed params object from deps, fetchData already has primitive deps

  return { data, loading, error, refetch: fetchData };
};

export const useSchool = (id: number | null) => {
  const [data, setData] = useState<School | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (id === null) return;

    try {
      setLoading(true);
      setError(null);
      const result = await schoolService.getSchoolById(id);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Không thể tải thông tin trường học');
      console.error('Fetch school error:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id !== null) {
      fetchData();
    }
  }, [fetchData, id]);

  return { data, loading, error, refetch: fetchData };
};

// ============================================================================
// GREEN COURSES HOOKS
// ============================================================================

export const useGreenCourses = (params?: GreenCourseParams) => {
  const [data, setData] = useState<GreenCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 [useGreenCourses] Fetching courses with params:', params);
      // API trả về array trực tiếp
      const result = await schoolService.getGreenCourses(params);
      console.log('✅ [useGreenCourses] Success! Received', result.length, 'courses');
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách khóa học');
      console.error('❌ [useGreenCourses] Error:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [params?.skip, params?.limit, params?.category, params?.difficulty]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, total: data.length, loading, error, refetch: fetchData };
};

export const useGreenCourse = (id: number | null) => {
  const [data, setData] = useState<GreenCourse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (id === null) return;

    try {
      setLoading(true);
      setError(null);
      const result = await schoolService.getGreenCourseById(id);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Không thể tải thông tin khóa học');
      console.error('Fetch green course error:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id !== null) {
      fetchData();
    }
  }, [fetchData, id]);

  return { data, loading, error, refetch: fetchData };
};

export const useCourseProgress = (courseId: number | null) => {
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (courseId === null) return;

    try {
      setLoading(true);
      setError(null);
      const result = await schoolService.getCourseProgress(courseId);
      setProgress(result.progress);
      setCompletedLessons(result.completed_lessons);
    } catch (err: any) {
      setError(err.message || 'Không thể tải tiến độ khóa học');
      console.error('Fetch course progress error:', err);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId !== null) {
      fetchData();
    }
  }, [fetchData, courseId]);

  return { progress, completedLessons, loading, error, refetch: fetchData };
};
