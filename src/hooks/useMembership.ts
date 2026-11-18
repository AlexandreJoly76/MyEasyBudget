import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export type Membership = {
  household_id: string
  role: 'manager' | 'member'
}

export function useMembership(userId: string) {
  return useQuery({
    queryKey: ['membership', userId],
    queryFn: async (): Promise<Membership | null> => {
      const { data, error } = await supabase
        .from('members')
        .select('household_id, role')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) throw error
      return data
    },
  })
}
