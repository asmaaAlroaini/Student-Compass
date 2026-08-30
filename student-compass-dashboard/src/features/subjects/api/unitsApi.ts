import { fetchClient } from '@/api/client';
import type { UnitsListResponse, UnitResponse, UnitFormData } from '../types/unit.types';

const BASE = '/admin/units';

export const unitsApi = {
  listBySubject: (subjectId: number): Promise<UnitsListResponse> =>
    fetchClient<UnitsListResponse>(`${BASE}?subject_id=${subjectId}`),

  create: (data: UnitFormData): Promise<UnitResponse> =>
    fetchClient<UnitResponse>(BASE, {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        unit_number: data.unit_number === '' ? null : data.unit_number,
        order: data.order === '' ? null : data.order,
      }),
    }),

  update: (id: number, data: Partial<UnitFormData>): Promise<UnitResponse> =>
    fetchClient<UnitResponse>(`${BASE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...data,
        unit_number: data.unit_number === '' ? null : data.unit_number,
        order: data.order === '' ? null : data.order,
      }),
    }),

  delete: (id: number): Promise<{ success: boolean; message: string }> =>
    fetchClient(`${BASE}/${id}`, { method: 'DELETE' }),
};
