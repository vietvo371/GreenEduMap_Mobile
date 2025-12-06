/**
 * Custom hook for Green Zones & Resources
 * Handles green zones and environmental resources data fetching
 */

import { useState, useEffect, useCallback } from 'react';
import { greenResourceService } from '../services';
import type {
  GreenZone,
  GreenResource,
  GreenZoneParams,
  GreenResourceParams,
  NearbyParams,
  DataCatalog,
} from '../types/api';

// ============================================================================
// GREEN ZONES HOOKS
// ============================================================================

export const useGreenZones = (params?: GreenZoneParams) => {
  const [data, setData] = useState<GreenZone[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await greenResourceService.getGreenZones(params);
      setData(result.data);
      setTotal(result.total);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách khu vực xanh');
      console.error('Fetch green zones error:', err);
    } finally {
      setLoading(false);
    }
  }, [params?.skip, params?.limit, params?.zone_type, params?.city, params?.district]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, total, loading, error, refetch: fetchData };
};

export const useNearbyGreenZones = (params: NearbyParams | null) => {
  const [data, setData] = useState<GreenZone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!params) return;

    try {
      setLoading(true);
      setError(null);
      const result = await greenResourceService.getNearbyGreenZones(params);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Không thể tìm khu vực xanh gần đây');
      console.error('Fetch nearby green zones error:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [params?.latitude, params?.longitude, params?.radius, params?.limit]);

  useEffect(() => {
    if (params) {
      fetchData();
    }
  }, [fetchData, params]);

  return { data, loading, error, refetch: fetchData };
};

export const useGreenZone = (id: number | null) => {
  const [data, setData] = useState<GreenZone | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (id === null) return;

    try {
      setLoading(true);
      setError(null);
      const result = await greenResourceService.getGreenZoneById(id);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Không thể tải thông tin khu vực xanh');
      console.error('Fetch green zone error:', err);
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
// GREEN RESOURCES HOOKS
// ============================================================================

export const useGreenResources = (params?: GreenResourceParams) => {
  const [data, setData] = useState<GreenResource[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await greenResourceService.getGreenResources(params);
      setData(result.data);
      setTotal(result.total);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách tài nguyên xanh');
      console.error('Fetch green resources error:', err);
    } finally {
      setLoading(false);
    }
  }, [params?.skip, params?.limit, params?.type, params?.city, params?.district]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, total, loading, error, refetch: fetchData };
};

export const useNearbyGreenResources = (params: NearbyParams | null) => {
  const [data, setData] = useState<GreenResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!params) return;

    try {
      setLoading(true);
      setError(null);
      const result = await greenResourceService.getNearbyGreenResources(params);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Không thể tìm tài nguyên xanh gần đây');
      console.error('Fetch nearby green resources error:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [params?.latitude, params?.longitude, params?.radius, params?.limit]);

  useEffect(() => {
    if (params) {
      fetchData();
    }
  }, [fetchData, params]);

  return { data, loading, error, refetch: fetchData };
};

export const useGreenResource = (id: number | null) => {
  const [data, setData] = useState<GreenResource | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (id === null) return;

    try {
      setLoading(true);
      setError(null);
      const result = await greenResourceService.getGreenResourceById(id);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Không thể tải thông tin tài nguyên xanh');
      console.error('Fetch green resource error:', err);
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
// CATALOG HOOK
// ============================================================================

export const useDataCatalog = () => {
  const [data, setData] = useState<DataCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await greenResourceService.getCatalog();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh mục dữ liệu');
      console.error('Fetch catalog error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
