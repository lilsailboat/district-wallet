export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      logo_contests: {
        Row: {
          contact_email: string | null
          created_at: string
          description: string | null
          id: string
          is_winner: boolean | null
          logo_url: string
          title: string
          user_id: string | null
          votes: number | null
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_winner?: boolean | null
          logo_url: string
          title: string
          user_id?: string | null
          votes?: number | null
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_winner?: boolean | null
          logo_url?: string
          title?: string
          user_id?: string | null
          votes?: number | null
        }
        Relationships: []
      }
      merchants: {
        Row: {
          business_address: string | null
          business_name: string
          created_at: string
          description: string | null
          ein: string | null
          email: string
          id: string
          is_approved: boolean | null
          logo_url: string | null
          phone: string | null
          pos_system: string | null
          qr_code: string | null
          total_redemptions: number | null
          total_rewards_distributed: number | null
          total_visits: number | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          business_address?: string | null
          business_name: string
          created_at?: string
          description?: string | null
          ein?: string | null
          email: string
          id?: string
          is_approved?: boolean | null
          logo_url?: string | null
          phone?: string | null
          pos_system?: string | null
          qr_code?: string | null
          total_redemptions?: number | null
          total_rewards_distributed?: number | null
          total_visits?: number | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          business_address?: string | null
          business_name?: string
          created_at?: string
          description?: string | null
          ein?: string | null
          email?: string
          id?: string
          is_approved?: boolean | null
          logo_url?: string | null
          phone?: string | null
          pos_system?: string | null
          qr_code?: string | null
          total_redemptions?: number | null
          total_rewards_distributed?: number | null
          total_visits?: number | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bank_name: string | null
          card_linked: boolean | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          masked_account: string | null
          phone: string | null
          plaid_access_token: string | null
          referral_code: string | null
          referrals_made: number | null
          total_points: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bank_name?: string | null
          card_linked?: boolean | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          masked_account?: string | null
          phone?: string | null
          plaid_access_token?: string | null
          referral_code?: string | null
          referrals_made?: number | null
          total_points?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bank_name?: string | null
          card_linked?: boolean | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          masked_account?: string | null
          phone?: string | null
          plaid_access_token?: string | null
          referral_code?: string | null
          referrals_made?: number | null
          total_points?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      redemptions: {
        Row: {
          expires_at: string | null
          id: string
          is_used: boolean | null
          points_used: number
          promo_code: string | null
          redeemed_at: string
          reward_id: string
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          id?: string
          is_used?: boolean | null
          points_used: number
          promo_code?: string | null
          redeemed_at?: string
          reward_id: string
          user_id: string
        }
        Update: {
          expires_at?: string | null
          id?: string
          is_used?: boolean | null
          points_used?: number
          promo_code?: string | null
          redeemed_at?: string
          reward_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          bonus_points: number | null
          completed_at: string | null
          created_at: string
          id: string
          referee_id: string | null
          referral_code: string
          referrer_id: string
          status: string | null
        }
        Insert: {
          bonus_points?: number | null
          completed_at?: string | null
          created_at?: string
          id?: string
          referee_id?: string | null
          referral_code: string
          referrer_id: string
          status?: string | null
        }
        Update: {
          bonus_points?: number | null
          completed_at?: string | null
          created_at?: string
          id?: string
          referee_id?: string | null
          referral_code?: string
          referrer_id?: string
          status?: string | null
        }
        Relationships: []
      }
      rewards: {
        Row: {
          created_at: string
          description: string | null
          expiration_date: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          merchant_id: string
          points_required: number
          promo_code: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          expiration_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          merchant_id: string
          points_required: number
          promo_code?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          expiration_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          merchant_id?: string
          points_required?: number
          promo_code?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "rewards_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          id: string
          location: string | null
          merchant_id: string | null
          points_earned: number
          status: string | null
          transaction_date: string
          user_id: string
        }
        Insert: {
          amount: number
          id?: string
          location?: string | null
          merchant_id?: string | null
          points_earned: number
          status?: string | null
          transaction_date?: string
          user_id: string
        }
        Update: {
          amount?: number
          id?: string
          location?: string | null
          merchant_id?: string | null
          points_earned?: number
          status?: string | null
          transaction_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
