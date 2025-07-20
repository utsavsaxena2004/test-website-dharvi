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
      cart_items: {
        Row: {
          color: string | null
          created_at: string
          id: string
          master_product_id: string | null
          product_id: string | null
          product_type: string | null
          quantity: number
          size: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          master_product_id?: string | null
          product_id?: string | null
          product_type?: string | null
          quantity?: number
          size?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          master_product_id?: string | null
          product_id?: string | null
          product_type?: string | null
          quantity?: number
          size?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_master_product_id_fkey"
            columns: ["master_product_id"]
            isOneToOne: false
            referencedRelation: "master_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          design_template: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          design_template?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          design_template?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      custom_designs: {
        Row: {
          budget: number | null
          contact_phone: string | null
          created_at: string
          deadline: string | null
          delivery_days: number | null
          description: string | null
          design_type: string | null
          email: string | null
          full_name: string | null
          id: string
          occasion: string | null
          preferred_colors: string | null
          reference_images: string[] | null
          size_requirements: string | null
          special_instructions: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          budget?: number | null
          contact_phone?: string | null
          created_at?: string
          deadline?: string | null
          delivery_days?: number | null
          description?: string | null
          design_type?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          occasion?: string | null
          preferred_colors?: string | null
          reference_images?: string[] | null
          size_requirements?: string | null
          special_instructions?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          budget?: number | null
          contact_phone?: string | null
          created_at?: string
          deadline?: string | null
          delivery_days?: number | null
          description?: string | null
          design_type?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          occasion?: string | null
          preferred_colors?: string | null
          reference_images?: string[] | null
          size_requirements?: string | null
          special_instructions?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      home_layout_sections: {
        Row: {
          config: Json | null
          created_at: string
          id: string
          is_visible: boolean | null
          position: number
          type: string
          updated_at: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          id?: string
          is_visible?: boolean | null
          position: number
          type: string
          updated_at?: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          id?: string
          is_visible?: boolean | null
          position?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          color: string | null
          created_at: string
          id: string
          product_id: string | null
          quantity: number | null
          size: string | null
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          product_id?: string | null
          quantity?: number | null
          size?: string | null
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          product_id?: string | null
          quantity?: number | null
          size?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      master_products: {
        Row: {
          colors: string[] | null
          created_at: string
          description: string | null
          id: string
          image_urls: string[] | null
          is_active: boolean | null
          name: string
          price: number
          special_points: string[] | null
          stock_quantity: number | null
          tag: string | null
          title: string
          updated_at: string
        }
        Insert: {
          colors?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean | null
          name: string
          price: number
          special_points?: string[] | null
          stock_quantity?: number | null
          tag?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          colors?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean | null
          name?: string
          price?: number
          special_points?: string[] | null
          stock_quantity?: number | null
          tag?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          color: string | null
          created_at: string
          id: string
          order_id: string | null
          price: number
          product_id: string | null
          quantity: number
          size: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          order_id?: string | null
          price: number
          product_id?: string | null
          quantity: number
          size?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          order_id?: string | null
          price?: number
          product_id?: string | null
          quantity?: number
          size?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          payment_method: string | null
          payment_status: string | null
          shipping_address_line1: string | null
          shipping_address_line2: string | null
          shipping_amount: number | null
          shipping_city: string | null
          shipping_country: string | null
          shipping_phone: string | null
          shipping_postal_code: string | null
          shipping_state: string | null
          status: string | null
          tax_amount: number | null
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          shipping_address_line1?: string | null
          shipping_address_line2?: string | null
          shipping_amount?: number | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_phone?: string | null
          shipping_postal_code?: string | null
          shipping_state?: string | null
          status?: string | null
          tax_amount?: number | null
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          shipping_address_line1?: string | null
          shipping_address_line2?: string | null
          shipping_amount?: number | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_phone?: string | null
          shipping_postal_code?: string | null
          shipping_state?: string | null
          status?: string | null
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          care_instructions: string | null
          category_id: string | null
          colors: string[] | null
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          image_urls: string[] | null
          is_active: boolean | null
          material: string | null
          name: string
          price: number
          sizes: string[] | null
          slug: string | null
          stock_quantity: number | null
          updated_at: string
        }
        Insert: {
          care_instructions?: string | null
          category_id?: string | null
          colors?: string[] | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean | null
          material?: string | null
          name: string
          price: number
          sizes?: string[] | null
          slug?: string | null
          stock_quantity?: number | null
          updated_at?: string
        }
        Update: {
          care_instructions?: string | null
          category_id?: string | null
          colors?: string[] | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean | null
          material?: string | null
          name?: string
          price?: number
          sizes?: string[] | null
          slug?: string | null
          stock_quantity?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          currency: string | null
          footer_content: Json | null
          free_shipping_threshold: number | null
          hero_content: Json | null
          id: string
          promotional_messages: Json | null
          shipping_cost: number | null
          site_description: string | null
          site_logo: string | null
          site_name: string | null
          social_facebook: string | null
          social_instagram: string | null
          social_whatsapp: string | null
          tax_rate: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          currency?: string | null
          footer_content?: Json | null
          free_shipping_threshold?: number | null
          hero_content?: Json | null
          id?: string
          promotional_messages?: Json | null
          shipping_cost?: number | null
          site_description?: string | null
          site_logo?: string | null
          site_name?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_whatsapp?: string | null
          tax_rate?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          currency?: string | null
          footer_content?: Json | null
          free_shipping_threshold?: number | null
          hero_content?: Json | null
          id?: string
          promotional_messages?: Json | null
          shipping_cost?: number | null
          site_description?: string | null
          site_logo?: string | null
          site_name?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_whatsapp?: string | null
          tax_rate?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          created_at: string
          id: string
          master_product_id: string | null
          product_id: string | null
          product_type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          master_product_id?: string | null
          product_id?: string | null
          product_type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          master_product_id?: string | null
          product_id?: string | null
          product_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_master_product_id_fkey"
            columns: ["master_product_id"]
            isOneToOne: false
            referencedRelation: "master_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
