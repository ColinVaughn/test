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
      admins: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      affiliate_analytics: {
        Row: {
          affiliate_id: string | null
          commission: number | null
          conversions: number | null
          date: string
          id: string
          revenue: number | null
          unique_visitors: number | null
          views: number | null
        }
        Insert: {
          affiliate_id?: string | null
          commission?: number | null
          conversions?: number | null
          date: string
          id?: string
          revenue?: number | null
          unique_visitors?: number | null
          views?: number | null
        }
        Update: {
          affiliate_id?: string | null
          commission?: number | null
          conversions?: number | null
          date?: string
          id?: string
          revenue?: number | null
          unique_visitors?: number | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_analytics_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_clicks: {
        Row: {
          affiliate_id: string | null
          conversion_id: string | null
          converted_at: string | null
          created_at: string | null
          id: string
          ip_hash: string | null
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          affiliate_id?: string | null
          conversion_id?: string | null
          converted_at?: string | null
          created_at?: string | null
          id?: string
          ip_hash?: string | null
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          affiliate_id?: string | null
          conversion_id?: string | null
          converted_at?: string | null
          created_at?: string | null
          id?: string
          ip_hash?: string | null
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_clicks_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_payouts: {
        Row: {
          affiliate_id: string | null
          amount: number
          created_at: string | null
          id: string
          paid_at: string | null
          payment_details: Json | null
          payment_method: string | null
          status: string
        }
        Insert: {
          affiliate_id?: string | null
          amount: number
          created_at?: string | null
          id?: string
          paid_at?: string | null
          payment_details?: Json | null
          payment_method?: string | null
          status?: string
        }
        Update: {
          affiliate_id?: string | null
          amount?: number
          created_at?: string | null
          id?: string
          paid_at?: string | null
          payment_details?: Json | null
          payment_method?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_payouts_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_sample_requests: {
        Row: {
          affiliate_id: string
          created_at: string | null
          id: string
          product_id: string | null
          program_id: string
          request_notes: string | null
          seller_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          affiliate_id: string
          created_at?: string | null
          id?: string
          product_id?: string | null
          program_id: string
          request_notes?: string | null
          seller_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          affiliate_id?: string
          created_at?: string | null
          id?: string
          product_id?: string | null
          program_id?: string
          request_notes?: string | null
          seller_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_sample_requests_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_sample_requests_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_sample_requests_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "seller_affiliate_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_sample_requests_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "marketplace_sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_transactions: {
        Row: {
          affiliate_id: string | null
          amount: number
          commission: number
          created_at: string | null
          customer_email: string | null
          id: string
          order_id: string
          paid_at: string | null
          status: string | null
        }
        Insert: {
          affiliate_id?: string | null
          amount: number
          commission: number
          created_at?: string | null
          customer_email?: string | null
          id?: string
          order_id: string
          paid_at?: string | null
          status?: string | null
        }
        Update: {
          affiliate_id?: string | null
          amount?: number
          commission?: number
          created_at?: string | null
          customer_email?: string | null
          id?: string
          order_id?: string
          paid_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_transactions_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          application_status: string
          bio: string | null
          code: string
          commission_rate: number
          created_at: string | null
          id: string
          is_active: boolean | null
          payout_info: Json | null
          rejection_reason: string | null
          social_media: Json | null
          total_earnings: number | null
          total_sales: number | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          application_status?: string
          bio?: string | null
          code: string
          commission_rate?: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          payout_info?: Json | null
          rejection_reason?: string | null
          social_media?: Json | null
          total_earnings?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          application_status?: string
          bio?: string | null
          code?: string
          commission_rate?: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          payout_info?: Json | null
          rejection_reason?: string | null
          social_media?: Json | null
          total_earnings?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_affiliate_user_profile"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      article_analytics: {
        Row: {
          article_id: string | null
          avg_read_time: number | null
          created_at: string | null
          id: string
          shares: number | null
          unique_visitors: number | null
          updated_at: string | null
          view_date: string
          views: number | null
        }
        Insert: {
          article_id?: string | null
          avg_read_time?: number | null
          created_at?: string | null
          id?: string
          shares?: number | null
          unique_visitors?: number | null
          updated_at?: string | null
          view_date?: string
          views?: number | null
        }
        Update: {
          article_id?: string | null
          avg_read_time?: number | null
          created_at?: string | null
          id?: string
          shares?: number | null
          unique_visitors?: number | null
          updated_at?: string | null
          view_date?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "article_analytics_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      article_category_relations: {
        Row: {
          article_id: string
          category_id: string
        }
        Insert: {
          article_id: string
          category_id: string
        }
        Update: {
          article_id?: string
          category_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_category_relations_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_category_relations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "article_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      article_comments: {
        Row: {
          article_id: string | null
          content: string
          created_at: string
          id: string
          moderation_status: string
          reported_count: number
          reports: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          article_id?: string | null
          content: string
          created_at?: string
          id?: string
          moderation_status?: string
          reported_count?: number
          reports?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          article_id?: string | null
          content?: string
          created_at?: string
          id?: string
          moderation_status?: string
          reported_count?: number
          reports?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "article_comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_images: {
        Row: {
          alt_text: string | null
          article_id: string | null
          caption: string | null
          created_at: string | null
          display_order: number
          id: string
          updated_at: string | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          article_id?: string | null
          caption?: string | null
          created_at?: string | null
          display_order?: number
          id?: string
          updated_at?: string | null
          url: string
        }
        Update: {
          alt_text?: string | null
          article_id?: string | null
          caption?: string | null
          created_at?: string | null
          display_order?: number
          id?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_images_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_notifications: {
        Row: {
          article_id: string
          id: string
          sent_at: string
          subscriber_id: string
        }
        Insert: {
          article_id: string
          id?: string
          sent_at?: string
          subscriber_id: string
        }
        Update: {
          article_id?: string
          id?: string
          sent_at?: string
          subscriber_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_notifications_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_notifications_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "newsletter_subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      article_reactions: {
        Row: {
          anonymous_user_hash: string | null
          article_id: string
          created_at: string
          id: string
          reaction_type: string
          user_id: string | null
        }
        Insert: {
          anonymous_user_hash?: string | null
          article_id: string
          created_at?: string
          id?: string
          reaction_type: string
          user_id?: string | null
        }
        Update: {
          anonymous_user_hash?: string | null
          article_id?: string
          created_at?: string
          id?: string
          reaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "article_reactions_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_tag_relations: {
        Row: {
          article_id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          tag_id: string
        }
        Update: {
          article_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_tag_relations_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_tag_relations_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "article_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      article_tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      article_views: {
        Row: {
          article_id: string | null
          id: string
          visited_at: string | null
          visitor_id: string
        }
        Insert: {
          article_id?: string | null
          id?: string
          visited_at?: string | null
          visitor_id: string
        }
        Update: {
          article_id?: string | null
          id?: string
          visited_at?: string | null
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_views_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_id: string
          canonical_url: string | null
          content: string
          cover_image: string | null
          created_at: string
          draft_content: string | null
          draft_updated_at: string | null
          excerpt: string | null
          featured: boolean | null
          id: string
          meta_description: string | null
          published_at: string | null
          share_count: number | null
          slug: string
          status: string
          title: string
          total_reading_time: number | null
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id: string
          canonical_url?: string | null
          content: string
          cover_image?: string | null
          created_at?: string
          draft_content?: string | null
          draft_updated_at?: string | null
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          meta_description?: string | null
          published_at?: string | null
          share_count?: number | null
          slug: string
          status?: string
          title: string
          total_reading_time?: number | null
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string
          canonical_url?: string | null
          content?: string
          cover_image?: string | null
          created_at?: string
          draft_content?: string | null
          draft_updated_at?: string | null
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          meta_description?: string | null
          published_at?: string | null
          share_count?: number | null
          slug?: string
          status?: string
          title?: string
          total_reading_time?: number | null
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          configuration: Json | null
          created_at: string
          details: Json | null
          id: string
          price: number
          product_id: string
          product_name: string
          product_type: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          configuration?: Json | null
          created_at?: string
          details?: Json | null
          id?: string
          price: number
          product_id: string
          product_name: string
          product_type: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          configuration?: Json | null
          created_at?: string
          details?: Json | null
          id?: string
          price?: number
          product_id?: string
          product_name?: string
          product_type?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      case_colors: {
        Row: {
          component_id: string | null
          created_at: string | null
          hex_code: string
          id: string
          name: string
          price_adjustment: number
        }
        Insert: {
          component_id?: string | null
          created_at?: string | null
          hex_code: string
          id?: string
          name: string
          price_adjustment?: number
        }
        Update: {
          component_id?: string | null
          created_at?: string | null
          hex_code?: string
          id?: string
          name?: string
          price_adjustment?: number
        }
        Relationships: [
          {
            foreignKeyName: "case_colors_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "pc_components"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          is_guest: boolean | null
          status: string | null
          subject: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_guest?: boolean | null
          status?: string | null
          subject?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_guest?: boolean | null
          status?: string | null
          subject?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          conversation_id: string | null
          created_at: string | null
          id: string
          is_admin: boolean | null
          message: string
          read: boolean | null
          user_id: string | null
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          is_admin?: boolean | null
          message: string
          read?: boolean | null
          user_id?: string | null
        }
        Update: {
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          is_admin?: boolean | null
          message?: string
          read?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_usage: {
        Row: {
          coupon_id: string | null
          id: string
          order_id: string | null
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          coupon_id?: string | null
          id?: string
          order_id?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          coupon_id?: string | null
          id?: string
          order_id?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupon_usage_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_usage_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          active: boolean | null
          code: string
          created_at: string | null
          current_uses: number | null
          discount_type: string
          discount_value: number
          expire_date: string | null
          id: string
          max_uses: number | null
          minimum_purchase: number | null
          start_date: string | null
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string | null
          current_uses?: number | null
          discount_type: string
          discount_value: number
          expire_date?: string | null
          id?: string
          max_uses?: number | null
          minimum_purchase?: number | null
          start_date?: string | null
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string | null
          current_uses?: number | null
          discount_type?: string
          discount_value?: number
          expire_date?: string | null
          id?: string
          max_uses?: number | null
          minimum_purchase?: number | null
          start_date?: string | null
        }
        Relationships: []
      }
      hosting_plans: {
        Row: {
          created_at: string | null
          description: string | null
          game_types: string[]
          id: string
          name: string
          price_monthly: number
          specs: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          game_types: string[]
          id?: string
          name: string
          price_monthly: number
          specs: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          game_types?: string[]
          id?: string
          name?: string
          price_monthly?: number
          specs?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      hosting_subscriptions: {
        Row: {
          created_at: string | null
          expires_at: string
          game_type: string
          id: string
          plan_id: string
          server_id: string | null
          started_at: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          game_type: string
          id?: string
          plan_id: string
          server_id?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          game_type?: string
          id?: string
          plan_id?: string
          server_id?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hosting_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "hosting_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_ad_preferences: {
        Row: {
          ads_enabled: boolean
          opted_in_at: string | null
          user_id: string
        }
        Insert: {
          ads_enabled?: boolean
          opted_in_at?: string | null
          user_id: string
        }
        Update: {
          ads_enabled?: boolean
          opted_in_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      marketplace_customer_messages: {
        Row: {
          created_at: string | null
          customer_email: string | null
          customer_id: string | null
          id: string
          message: string
          order_id: string | null
          product_name: string | null
          seller_id: string
          status: string
          subject: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_email?: string | null
          customer_id?: string | null
          id?: string
          message: string
          order_id?: string | null
          product_name?: string | null
          seller_id: string
          status?: string
          subject: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_email?: string | null
          customer_id?: string | null
          id?: string
          message?: string
          order_id?: string | null
          product_name?: string | null
          seller_id?: string
          status?: string
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_customer_messages_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "marketplace_sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_message_replies: {
        Row: {
          created_at: string | null
          id: string
          message_id: string
          reply: string
          seller_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message_id: string
          reply: string
          seller_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message_id?: string
          reply?: string
          seller_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_message_replies_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "marketplace_customer_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_message_replies_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "marketplace_sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_orders: {
        Row: {
          commission_amount: number
          created_at: string | null
          id: string
          order_id: string
          price_per_unit: number
          product_id: string
          quantity: number
          seller_id: string
          seller_payout: number
          status: string
          total_price: number
          updated_at: string | null
        }
        Insert: {
          commission_amount: number
          created_at?: string | null
          id?: string
          order_id: string
          price_per_unit: number
          product_id: string
          quantity: number
          seller_id: string
          seller_payout: number
          status?: string
          total_price: number
          updated_at?: string | null
        }
        Update: {
          commission_amount?: number
          created_at?: string | null
          id?: string
          order_id?: string
          price_per_unit?: number
          product_id?: string
          quantity?: number
          seller_id?: string
          seller_payout?: number
          status?: string
          total_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_orders_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "marketplace_sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_payouts: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          paid_at: string | null
          payment_details: Json | null
          payment_method: string
          seller_id: string
          status: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          paid_at?: string | null
          payment_details?: Json | null
          payment_method: string
          seller_id: string
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          paid_at?: string | null
          payment_details?: Json | null
          payment_method?: string
          seller_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_payouts_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "marketplace_sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_products: {
        Row: {
          category: string
          condition: string
          created_at: string | null
          description: string | null
          featured: boolean | null
          id: string
          images: string[] | null
          name: string
          price: number
          seller_id: string
          shipping: Json | null
          specs: Json | null
          status: string
          stock_quantity: number
          updated_at: string | null
        }
        Insert: {
          category: string
          condition?: string
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          name: string
          price: number
          seller_id: string
          shipping?: Json | null
          specs?: Json | null
          status?: string
          stock_quantity?: number
          updated_at?: string | null
        }
        Update: {
          category?: string
          condition?: string
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          name?: string
          price?: number
          seller_id?: string
          shipping?: Json | null
          specs?: Json | null
          status?: string
          stock_quantity?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "marketplace_sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_promotions: {
        Row: {
          code: string | null
          created_at: string | null
          description: string | null
          discount_type: string
          discount_value: number
          end_date: string | null
          id: string
          is_active: boolean | null
          name: string
          product_id: string | null
          seller_id: string
          start_date: string
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          description?: string | null
          discount_type: string
          discount_value: number
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          product_id?: string | null
          seller_id: string
          start_date: string
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          product_id?: string | null
          seller_id?: string
          start_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_promotions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_promotions_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "marketplace_sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_sellers: {
        Row: {
          about_text: string | null
          approved: boolean | null
          banner_url: string | null
          buyer_protection_policy: string | null
          commission_rate: number | null
          created_at: string | null
          description: string | null
          id: string
          logo_url: string | null
          payment_details: Json | null
          policies: Json | null
          return_policy: string | null
          social_links: Json | null
          store_name: string
          store_slug: string
          stripe_connect_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          about_text?: string | null
          approved?: boolean | null
          banner_url?: string | null
          buyer_protection_policy?: string | null
          commission_rate?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          payment_details?: Json | null
          policies?: Json | null
          return_policy?: string | null
          social_links?: Json | null
          store_name: string
          store_slug: string
          stripe_connect_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          about_text?: string | null
          approved?: boolean | null
          banner_url?: string | null
          buyer_protection_policy?: string | null
          commission_rate?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          payment_details?: Json | null
          policies?: Json | null
          return_policy?: string | null
          social_links?: Json | null
          store_name?: string
          store_slug?: string
          stripe_connect_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          confirmed: boolean
          email: string
          id: string
          notification_preferences: Json | null
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          confirmed?: boolean
          email: string
          id?: string
          notification_preferences?: Json | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          confirmed?: boolean
          email?: string
          id?: string
          notification_preferences?: Json | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          price: number
          product_details: Json | null
          product_id: string
          product_name: string
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          price: number
          product_details?: Json | null
          product_id: string
          product_name: string
          quantity: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          price?: number
          product_details?: Json | null
          product_id?: string
          product_name?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          admin_created: boolean | null
          affiliate_code: string | null
          coupon_code: string | null
          created_at: string | null
          discount_amount: number | null
          free_shipping_applied: boolean | null
          id: string
          notes: string | null
          paypal_order_id: string | null
          shipping_discount: number | null
          status: string
          stripe_session_id: string | null
          total: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_created?: boolean | null
          affiliate_code?: string | null
          coupon_code?: string | null
          created_at?: string | null
          discount_amount?: number | null
          free_shipping_applied?: boolean | null
          id?: string
          notes?: string | null
          paypal_order_id?: string | null
          shipping_discount?: number | null
          status?: string
          stripe_session_id?: string | null
          total: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_created?: boolean | null
          affiliate_code?: string | null
          coupon_code?: string | null
          created_at?: string | null
          discount_amount?: number | null
          free_shipping_applied?: boolean | null
          id?: string
          notes?: string | null
          paypal_order_id?: string | null
          shipping_discount?: number | null
          status?: string
          stripe_session_id?: string | null
          total?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string | null
          customer_email: string | null
          id: string
          order_id: string | null
          payment_method: string
          status: string
          transaction_id: string | null
          zelle_notes: string | null
          zelle_received_amount: number | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          customer_email?: string | null
          id?: string
          order_id?: string | null
          payment_method: string
          status: string
          transaction_id?: string | null
          zelle_notes?: string | null
          zelle_received_amount?: number | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          customer_email?: string | null
          id?: string
          order_id?: string | null
          payment_method?: string
          status?: string
          transaction_id?: string | null
          zelle_notes?: string | null
          zelle_received_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      pc_components: {
        Row: {
          amazon_link: string | null
          brand: string
          category: Database["public"]["Enums"]["component_category"]
          cooling_capacity: number | null
          created_at: string | null
          fan_size: number | null
          fan_slots: number | null
          id: string
          image_url: string | null
          name: string
          pre_installed_fans: number | null
          price: number
          specs: Json
          updated_at: string | null
          wattage: number | null
        }
        Insert: {
          amazon_link?: string | null
          brand: string
          category: Database["public"]["Enums"]["component_category"]
          cooling_capacity?: number | null
          created_at?: string | null
          fan_size?: number | null
          fan_slots?: number | null
          id?: string
          image_url?: string | null
          name: string
          pre_installed_fans?: number | null
          price: number
          specs?: Json
          updated_at?: string | null
          wattage?: number | null
        }
        Update: {
          amazon_link?: string | null
          brand?: string
          category?: Database["public"]["Enums"]["component_category"]
          cooling_capacity?: number | null
          created_at?: string | null
          fan_size?: number | null
          fan_slots?: number | null
          id?: string
          image_url?: string | null
          name?: string
          pre_installed_fans?: number | null
          price?: number
          specs?: Json
          updated_at?: string | null
          wattage?: number | null
        }
        Relationships: []
      }
      pc_hosting_benefits: {
        Row: {
          claimed_at: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          order_id: string
          status: string
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          claimed_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          order_id: string
          status?: string
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          claimed_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          order_id?: string
          status?: string
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pc_hosting_benefits_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pc_hosting_benefits_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "hosting_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      prebuilt_benchmarks: {
        Row: {
          created_at: string
          fps: number
          game: string
          id: string
          prebuilt_id: string
        }
        Insert: {
          created_at?: string
          fps: number
          game: string
          id?: string
          prebuilt_id: string
        }
        Update: {
          created_at?: string
          fps?: number
          game?: string
          id?: string
          prebuilt_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prebuilt_benchmarks_prebuilt_id_fkey"
            columns: ["prebuilt_id"]
            isOneToOne: false
            referencedRelation: "prebuilt_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      prebuilt_systems: {
        Row: {
          bestseller: boolean
          category: string
          created_at: string
          description: string | null
          discount: number
          featured: boolean
          gallery: string[] | null
          id: string
          image_url: string | null
          name: string
          new: boolean
          original_price: number
          price: number
          rating: number | null
          reviews: number | null
          specs: Json
          updated_at: string
        }
        Insert: {
          bestseller?: boolean
          category: string
          created_at?: string
          description?: string | null
          discount?: number
          featured?: boolean
          gallery?: string[] | null
          id?: string
          image_url?: string | null
          name: string
          new?: boolean
          original_price: number
          price: number
          rating?: number | null
          reviews?: number | null
          specs?: Json
          updated_at?: string
        }
        Update: {
          bestseller?: boolean
          category?: string
          created_at?: string
          description?: string | null
          discount?: number
          featured?: boolean
          gallery?: string[] | null
          id?: string
          image_url?: string | null
          name?: string
          new?: boolean
          original_price?: number
          price?: number
          rating?: number | null
          reviews?: number | null
          specs?: Json
          updated_at?: string
        }
        Relationships: []
      }
      rma_requests: {
        Row: {
          created_at: string
          id: string
          items: Json
          notes: string | null
          order_id: string
          reason: string
          shipping_label_url: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          items?: Json
          notes?: string | null
          order_id: string
          reason: string
          shipping_label_url?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          items?: Json
          notes?: string | null
          order_id?: string
          reason?: string
          shipping_label_url?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rma_requests_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_addresses: {
        Row: {
          city: string
          country: string | null
          created_at: string | null
          id: string
          is_default: boolean | null
          line1: string
          line2: string | null
          name: string
          postal_code: string
          state: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          city: string
          country?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          line1: string
          line2?: string | null
          name: string
          postal_code: string
          state: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          city?: string
          country?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          line1?: string
          line2?: string | null
          name?: string
          postal_code?: string
          state?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      saved_configurations: {
        Row: {
          configuration: Json
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          configuration: Json
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          configuration?: Json
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      seller_affiliate_programs: {
        Row: {
          affiliate_id: string
          commission_rate: number | null
          created_at: string | null
          id: string
          product_id: string | null
          program_type: string
          requirements: string | null
          seller_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          affiliate_id: string
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          program_type: string
          requirements?: string | null
          seller_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          affiliate_id?: string
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          program_type?: string
          requirements?: string | null
          seller_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seller_affiliate_programs_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seller_affiliate_programs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seller_affiliate_programs_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "marketplace_sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          carrier: string | null
          created_at: string | null
          estimated_delivery: string | null
          id: string
          order_id: string | null
          status: string | null
          tracking_number: string | null
          tracking_url: string | null
          updated_at: string | null
        }
        Insert: {
          carrier?: string | null
          created_at?: string | null
          estimated_delivery?: string | null
          id?: string
          order_id?: string | null
          status?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string | null
        }
        Update: {
          carrier?: string | null
          created_at?: string | null
          estimated_delivery?: string | null
          id?: string
          order_id?: string | null
          status?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          id: string
          notification_preferences: Json | null
          theme: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notification_preferences?: Json | null
          theme?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notification_preferences?: Json | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          product_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          product_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          product_type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_or_update_article: {
        Args:
          | {
              p_id?: string
              p_title?: string
              p_content?: string
              p_excerpt?: string
              p_cover_image?: string
              p_featured?: boolean
              p_slug?: string
              p_status?: string
            }
          | {
              p_id?: string
              p_title?: string
              p_content?: string
              p_excerpt?: string
              p_cover_image?: string
              p_featured?: boolean
              p_slug?: string
              p_status?: string
              p_meta_description?: string
              p_canonical_url?: string
            }
        Returns: string
      }
      fetch_users_for_admin: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          created_at: string
        }[]
      }
      increment: {
        Args: { row_id: string; x: number; column_name: string }
        Returns: number
      }
      increment_article_view: {
        Args: { article_id_param: string; visitor_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: { user_id_param: string }
        Returns: boolean
      }
    }
    Enums: {
      component_category:
        | "cpu"
        | "motherboard"
        | "gpu"
        | "ram"
        | "storage"
        | "cooler"
        | "case"
        | "psu"
        | "os"
        | "fans"
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
      component_category: [
        "cpu",
        "motherboard",
        "gpu",
        "ram",
        "storage",
        "cooler",
        "case",
        "psu",
        "os",
        "fans",
      ],
    },
  },
} as const
