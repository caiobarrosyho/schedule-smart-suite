export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointment_recurrences: {
        Row: {
          appointment_id: string
          created_at: string | null
          end_date: string
          id: string
          interval: number
          pattern: Database["public"]["Enums"]["recurrence_pattern"]
          updated_at: string | null
        }
        Insert: {
          appointment_id: string
          created_at?: string | null
          end_date: string
          id?: string
          interval?: number
          pattern: Database["public"]["Enums"]["recurrence_pattern"]
          updated_at?: string | null
        }
        Update: {
          appointment_id?: string
          created_at?: string | null
          end_date?: string
          id?: string
          interval?: number
          pattern?: Database["public"]["Enums"]["recurrence_pattern"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_recurrences_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          changed_at: string | null
          changed_by: string | null
          client_id: string
          created_at: string | null
          end_time: string
          id: string
          notes: string | null
          previous_end_time: string | null
          previous_start_time: string | null
          professional_id: string
          reschedule_count: number | null
          service_id: string | null
          start_time: string
          status: Database["public"]["Enums"]["appointment_status"] | null
          tenant_id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          changed_at?: string | null
          changed_by?: string | null
          client_id: string
          created_at?: string | null
          end_time: string
          id?: string
          notes?: string | null
          previous_end_time?: string | null
          previous_start_time?: string | null
          professional_id: string
          reschedule_count?: number | null
          service_id?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          tenant_id: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          changed_at?: string | null
          changed_by?: string | null
          client_id?: string
          created_at?: string | null
          end_time?: string
          id?: string
          notes?: string | null
          previous_end_time?: string | null
          previous_start_time?: string | null
          professional_id?: string
          reschedule_count?: number | null
          service_id?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          tenant_id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      breaks: {
        Row: {
          created_at: string | null
          day_of_week: number
          description: string | null
          end_time: string
          id: string
          professional_id: string
          start_time: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          description?: string | null
          end_time: string
          id?: string
          professional_id: string
          start_time: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          description?: string | null
          end_time?: string
          id?: string
          professional_id?: string
          start_time?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "breaks_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breaks_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      client_documents: {
        Row: {
          category: string
          client_id: string
          created_at: string | null
          file_type: string
          file_url: string
          id: string
          name: string
          notes: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          category: string
          client_id: string
          created_at?: string | null
          file_type: string
          file_url: string
          id?: string
          name: string
          notes?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          client_id?: string
          created_at?: string | null
          file_type?: string
          file_url?: string
          id?: string
          name?: string
          notes?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_documents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      client_tag_associations: {
        Row: {
          client_id: string
          created_at: string | null
          id: string
          tag_id: string
        }
        Insert: {
          client_id: string
          created_at?: string | null
          id?: string
          tag_id: string
        }
        Update: {
          client_id?: string
          created_at?: string | null
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_tag_associations_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "client_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      client_tags: {
        Row: {
          color: string
          created_at: string | null
          id: string
          name: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          color: string
          created_at?: string | null
          id?: string
          name: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          color?: string
          created_at?: string | null
          id?: string
          name?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_tags_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      holidays: {
        Row: {
          created_at: string | null
          date: string
          id: string
          is_recurring: boolean | null
          name: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          is_recurring?: boolean | null
          name: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          is_recurring?: boolean | null
          name?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "holidays_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          appointment_id: string | null
          channel: Database["public"]["Enums"]["notification_channel"]
          content: string
          delivered_at: string | null
          error_message: string | null
          id: string
          read_at: string | null
          sent_at: string
          status: string
          tenant_id: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          appointment_id?: string | null
          channel: Database["public"]["Enums"]["notification_channel"]
          content: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          read_at?: string | null
          sent_at?: string
          status?: string
          tenant_id: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          appointment_id?: string | null
          channel?: Database["public"]["Enums"]["notification_channel"]
          content?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          read_at?: string | null
          sent_at?: string
          status?: string
          tenant_id?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          appointment_id: string | null
          client_id: string
          created_at: string | null
          id: string
          installments: number | null
          method: Database["public"]["Enums"]["payment_method"] | null
          notes: string | null
          paid_at: string | null
          receipt_url: string | null
          refunded_at: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          appointment_id?: string | null
          client_id: string
          created_at?: string | null
          id?: string
          installments?: number | null
          method?: Database["public"]["Enums"]["payment_method"] | null
          notes?: string | null
          paid_at?: string | null
          receipt_url?: string | null
          refunded_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          appointment_id?: string | null
          client_id?: string
          created_at?: string | null
          id?: string
          installments?: number | null
          method?: Database["public"]["Enums"]["payment_method"] | null
          notes?: string | null
          paid_at?: string | null
          receipt_url?: string | null
          refunded_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      professionals: {
        Row: {
          bio: string | null
          color: string | null
          created_at: string | null
          id: string
          specialty: string | null
          tenant_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          color?: string | null
          created_at?: string | null
          id?: string
          specialty?: string | null
          tenant_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bio?: string | null
          color?: string | null
          created_at?: string | null
          id?: string
          specialty?: string | null
          tenant_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "professionals_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          medical_notes: string | null
          phone: string | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          medical_notes?: string | null
          phone?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          medical_notes?: string | null
          phone?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_categories_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category_id: string | null
          color: string | null
          created_at: string | null
          description: string | null
          duration: number
          id: string
          is_active: boolean | null
          name: string
          price: number
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          duration: number
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_subscriptions: {
        Row: {
          amount: number
          auto_renew: boolean | null
          cancelled_at: string | null
          created_at: string | null
          currency: string | null
          end_date: string | null
          id: string
          is_annual: boolean | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          payment_provider_id: string | null
          plan_id: string
          start_date: string
          status: string
          tenant_id: string
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          auto_renew?: boolean | null
          cancelled_at?: string | null
          created_at?: string | null
          currency?: string | null
          end_date?: string | null
          id?: string
          is_annual?: boolean | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_provider_id?: string | null
          plan_id: string
          start_date?: string
          status?: string
          tenant_id: string
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          auto_renew?: boolean | null
          cancelled_at?: string | null
          created_at?: string | null
          currency?: string | null
          end_date?: string | null
          id?: string
          is_annual?: boolean | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_provider_id?: string | null
          plan_id?: string
          start_date?: string
          status?: string
          tenant_id?: string
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_subscriptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string | null
          custom_colors: Json | null
          id: string
          logo_url: string | null
          name: string
          settings: Json | null
          subdomain: string
          subscription_status: string | null
          theme: string | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          custom_colors?: Json | null
          id?: string
          logo_url?: string | null
          name: string
          settings?: Json | null
          subdomain: string
          subscription_status?: string | null
          theme?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          custom_colors?: Json | null
          id?: string
          logo_url?: string | null
          name?: string
          settings?: Json | null
          subdomain?: string
          subscription_status?: string | null
          theme?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      working_hours: {
        Row: {
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_working: boolean | null
          professional_id: string
          start_time: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_working?: boolean | null
          professional_id: string
          start_time: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_working?: boolean | null
          professional_id?: string
          start_time?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "working_hours_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "working_hours_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          tenant_uuid: string
          role_name: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      appointment_status:
        | "scheduled"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "no_show"
        | "rescheduled"
        | "waiting_list"
      notification_channel: "email" | "whatsapp" | "sms" | "push"
      notification_type:
        | "welcome"
        | "appointment_reminder"
        | "appointment_confirmation"
        | "appointment_cancellation"
        | "appointment_rescheduled"
        | "payment_due"
        | "payment_received"
      payment_method:
        | "credit_card"
        | "debit_card"
        | "cash"
        | "pix"
        | "bank_transfer"
        | "other"
      payment_status:
        | "pending"
        | "paid"
        | "partially_paid"
        | "refunded"
        | "cancelled"
      recurrence_pattern: "daily" | "weekly" | "monthly"
      user_role: "super_admin" | "admin" | "professional" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      appointment_status: [
        "scheduled",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "no_show",
        "rescheduled",
        "waiting_list",
      ],
      notification_channel: ["email", "whatsapp", "sms", "push"],
      notification_type: [
        "welcome",
        "appointment_reminder",
        "appointment_confirmation",
        "appointment_cancellation",
        "appointment_rescheduled",
        "payment_due",
        "payment_received",
      ],
      payment_method: [
        "credit_card",
        "debit_card",
        "cash",
        "pix",
        "bank_transfer",
        "other",
      ],
      payment_status: [
        "pending",
        "paid",
        "partially_paid",
        "refunded",
        "cancelled",
      ],
      recurrence_pattern: ["daily", "weekly", "monthly"],
      user_role: ["super_admin", "admin", "professional", "client"],
    },
  },
} as const
