/**
 * Hand-maintained Supabase Database types for Phase 9A.
 * Regenerate after schema changes with:
 *   npm run db:types
 * (requires linked project / local supabase start)
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          professional_title: string | null;
          email: string | null;
          phone: string | null;
          location: string | null;
          country: string | null;
          linkedin_url: string | null;
          portfolio_url: string | null;
          github_url: string | null;
          website_url: string | null;
          photo_url: string | null;
          career_level: string | null;
          industry: string | null;
          years_of_experience: number | null;
          employment_status: string | null;
          preferred_language: string | null;
          profile_completion: number;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          professional_title?: string | null;
          email?: string | null;
          phone?: string | null;
          location?: string | null;
          country?: string | null;
          linkedin_url?: string | null;
          portfolio_url?: string | null;
          github_url?: string | null;
          website_url?: string | null;
          photo_url?: string | null;
          career_level?: string | null;
          industry?: string | null;
          years_of_experience?: number | null;
          employment_status?: string | null;
          preferred_language?: string | null;
          profile_completion?: number;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      user_preferences: {
        Row: {
          user_id: string;
          writing_style: string | null;
          ai_assistance_level: string | null;
          default_template_id: string | null;
          default_language: string;
          default_cv_style: string | null;
          default_font: string | null;
          default_color_theme: string | null;
          date_format: string;
          page_size: string;
          theme: string;
          accent: string | null;
          animations_enabled: boolean;
          compact_mode: boolean;
          notify_email: boolean;
          notify_product_updates: boolean;
          notify_ai_suggestions: boolean;
          notify_cv_reminders: boolean;
          notify_template_releases: boolean;
          notify_tips: boolean;
          ai_flags: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          writing_style?: string | null;
          ai_assistance_level?: string | null;
          default_template_id?: string | null;
          default_language?: string;
          default_cv_style?: string | null;
          default_font?: string | null;
          default_color_theme?: string | null;
          date_format?: string;
          page_size?: string;
          theme?: string;
          accent?: string | null;
          animations_enabled?: boolean;
          compact_mode?: boolean;
          notify_email?: boolean;
          notify_product_updates?: boolean;
          notify_ai_suggestions?: boolean;
          notify_cv_reminders?: boolean;
          notify_template_releases?: boolean;
          notify_tips?: boolean;
          ai_flags?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["user_preferences"]["Insert"]
        >;
        Relationships: [];
      };
      templates: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          category: string | null;
          preview_image_path: string | null;
          ats_compatible: boolean;
          is_free: boolean;
          is_premium: boolean;
          is_active: boolean;
          is_featured: boolean;
          editor_style: string | null;
          metadata: Json;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          category?: string | null;
          preview_image_path?: string | null;
          ats_compatible?: boolean;
          is_free?: boolean;
          is_premium?: boolean;
          is_active?: boolean;
          is_featured?: boolean;
          editor_style?: string | null;
          metadata?: Json;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["templates"]["Insert"]>;
        Relationships: [];
      };
      cvs: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          template_id: string | null;
          template_key: string;
          status: string;
          target_role: string | null;
          target_industry: string | null;
          language: string;
          is_default: boolean;
          score: number | null;
          completion: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          template_id?: string | null;
          template_key?: string;
          status?: string;
          target_role?: string | null;
          target_industry?: string | null;
          language?: string;
          is_default?: boolean;
          score?: number | null;
          completion?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["cvs"]["Insert"]>;
        Relationships: [];
      };
      cv_sections: {
        Row: {
          id: string;
          cv_id: string;
          section_type: string;
          title: string;
          sort_order: number;
          is_visible: boolean;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cv_id: string;
          section_type: string;
          title: string;
          sort_order?: number;
          is_visible?: boolean;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["cv_sections"]["Insert"]>;
        Relationships: [];
      };
      cv_personal_info: {
        Row: {
          cv_id: string;
          photo_url: string | null;
          given_name: string | null;
          family_name: string | null;
          full_name: string | null;
          professional_title: string | null;
          use_as_headline: boolean;
          email: string | null;
          phone: string | null;
          address: string | null;
          post_code: string | null;
          city: string | null;
          location: string | null;
          drivers_license: string | null;
          linkedin: string | null;
          portfolio: string | null;
          social_links: string[];
          date_of_birth: string | null;
          place_of_birth: string | null;
          gender: string | null;
          nationality: string | null;
          civil_status: string | null;
          custom_fields: Json;
          field_visibility: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          cv_id: string;
          photo_url?: string | null;
          given_name?: string | null;
          family_name?: string | null;
          full_name?: string | null;
          professional_title?: string | null;
          use_as_headline?: boolean;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          post_code?: string | null;
          city?: string | null;
          location?: string | null;
          drivers_license?: string | null;
          linkedin?: string | null;
          portfolio?: string | null;
          social_links?: string[];
          date_of_birth?: string | null;
          place_of_birth?: string | null;
          gender?: string | null;
          nationality?: string | null;
          civil_status?: string | null;
          custom_fields?: Json;
          field_visibility?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["cv_personal_info"]["Insert"]
        >;
        Relationships: [];
      };
      cv_summaries: {
        Row: {
          cv_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          cv_id: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["cv_summaries"]["Insert"]>;
        Relationships: [];
      };
      work_experiences: {
        Row: {
          id: string;
          cv_id: string;
          experience_type: string;
          company_name: string | null;
          organization_name: string | null;
          department: string | null;
          job_title: string | null;
          programme_name: string | null;
          project_name: string | null;
          client_name: string | null;
          cause: string | null;
          impact: string | null;
          rotation_details: string | null;
          location: string | null;
          date_mode: string;
          start_month: string | null;
          start_year: string | null;
          end_month: string | null;
          end_year: string | null;
          start_date: string | null;
          end_date: string | null;
          is_current: boolean;
          duration_text: string | null;
          description: string | null;
          technologies: string[];
          portfolio_link: string | null;
          supervisor_name: string | null;
          supervisor_position: string | null;
          supervisor_email: string | null;
          supervisor_phone: string | null;
          include_supervisor_on_export: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cv_id: string;
          experience_type: string;
          company_name?: string | null;
          organization_name?: string | null;
          department?: string | null;
          job_title?: string | null;
          programme_name?: string | null;
          project_name?: string | null;
          client_name?: string | null;
          cause?: string | null;
          impact?: string | null;
          rotation_details?: string | null;
          location?: string | null;
          date_mode?: string;
          start_month?: string | null;
          start_year?: string | null;
          end_month?: string | null;
          end_year?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          is_current?: boolean;
          duration_text?: string | null;
          description?: string | null;
          technologies?: string[];
          portfolio_link?: string | null;
          supervisor_name?: string | null;
          supervisor_position?: string | null;
          supervisor_email?: string | null;
          supervisor_phone?: string | null;
          include_supervisor_on_export?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["work_experiences"]["Insert"]
        >;
        Relationships: [];
      };
      experience_bullets: {
        Row: {
          id: string;
          experience_id: string;
          bullet_type: string;
          content: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          experience_id: string;
          bullet_type?: string;
          content: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["experience_bullets"]["Insert"]
        >;
        Relationships: [];
      };
      educations: {
        Row: {
          id: string;
          cv_id: string;
          qualification_type: string;
          examination_board: string | null;
          examination_board_other: string | null;
          school_name: string | null;
          year_completed: string | null;
          candidate_number: string | null;
          location: string | null;
          institution: string | null;
          qualification: string | null;
          field_of_study: string | null;
          start_date: string | null;
          end_date: string | null;
          completion_year: string | null;
          grade: string | null;
          description: string | null;
          achievements: string | null;
          certificate_name: string | null;
          credential_number: string | null;
          certification_name: string | null;
          issuing_organization: string | null;
          issue_date: string | null;
          expiry_date: string | null;
          credential_id: string | null;
          verification_url: string | null;
          training_provider: string | null;
          programme_name: string | null;
          duration: string | null;
          completion_date: string | null;
          skills_acquired: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cv_id: string;
          qualification_type: string;
          examination_board?: string | null;
          examination_board_other?: string | null;
          school_name?: string | null;
          year_completed?: string | null;
          candidate_number?: string | null;
          location?: string | null;
          institution?: string | null;
          qualification?: string | null;
          field_of_study?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          completion_year?: string | null;
          grade?: string | null;
          description?: string | null;
          achievements?: string | null;
          certificate_name?: string | null;
          credential_number?: string | null;
          certification_name?: string | null;
          issuing_organization?: string | null;
          issue_date?: string | null;
          expiry_date?: string | null;
          credential_id?: string | null;
          verification_url?: string | null;
          training_provider?: string | null;
          programme_name?: string | null;
          duration?: string | null;
          completion_date?: string | null;
          skills_acquired?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["educations"]["Insert"]>;
        Relationships: [];
      };
      education_subjects: {
        Row: {
          id: string;
          education_id: string;
          subject_name: string;
          grade: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          education_id: string;
          subject_name: string;
          grade: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["education_subjects"]["Insert"]
        >;
        Relationships: [];
      };
      skills: {
        Row: {
          id: string;
          cv_id: string;
          name: string;
          category: string;
          proficiency_level: number | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cv_id: string;
          name: string;
          category?: string;
          proficiency_level?: number | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["skills"]["Insert"]>;
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          cv_id: string;
          project_name: string;
          description: string | null;
          technologies: string[];
          project_url: string | null;
          repository_url: string | null;
          image_url: string | null;
          start_date: string | null;
          end_date: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cv_id: string;
          project_name: string;
          description?: string | null;
          technologies?: string[];
          project_url?: string | null;
          repository_url?: string | null;
          image_url?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
        Relationships: [];
      };
      certifications: {
        Row: {
          id: string;
          cv_id: string;
          certification_name: string;
          issuing_organization: string | null;
          issue_date: string | null;
          expiry_date: string | null;
          credential_id: string | null;
          verification_url: string | null;
          description: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cv_id: string;
          certification_name: string;
          issuing_organization?: string | null;
          issue_date?: string | null;
          expiry_date?: string | null;
          credential_id?: string | null;
          verification_url?: string | null;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["certifications"]["Insert"]
        >;
        Relationships: [];
      };
      languages: {
        Row: {
          id: string;
          cv_id: string;
          language: string;
          proficiency: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cv_id: string;
          language: string;
          proficiency?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["languages"]["Insert"]>;
        Relationships: [];
      };
      achievements: {
        Row: {
          id: string;
          cv_id: string;
          title: string;
          description: string | null;
          achievement_date: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cv_id: string;
          title: string;
          description?: string | null;
          achievement_date?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["achievements"]["Insert"]>;
        Relationships: [];
      };
      cv_references: {
        Row: {
          id: string;
          cv_id: string;
          name: string;
          relationship: string | null;
          contact: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cv_id: string;
          name: string;
          relationship?: string | null;
          contact?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["cv_references"]["Insert"]
        >;
        Relationships: [];
      };
      cv_versions: {
        Row: {
          id: string;
          cv_id: string;
          version_number: number;
          label: string | null;
          note: string | null;
          snapshot: Json;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          cv_id: string;
          version_number: number;
          label?: string | null;
          note?: string | null;
          snapshot: Json;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["cv_versions"]["Insert"]>;
        Relationships: [];
      };
      user_template_customizations: {
        Row: {
          id: string;
          user_id: string;
          template_id: string | null;
          template_slug: string | null;
          name: string;
          customization: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          template_id?: string | null;
          template_slug?: string | null;
          name?: string;
          customization?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["user_template_customizations"]["Insert"]
        >;
        Relationships: [];
      };
      cover_letters: {
        Row: {
          id: string;
          user_id: string;
          cv_id: string | null;
          template_id: string | null;
          template_key: string;
          title: string;
          company_name: string | null;
          job_title: string | null;
          job_description: string | null;
          hiring_manager: string | null;
          company_website: string | null;
          company_location: string | null;
          tone: string | null;
          length: string | null;
          content: Json;
          job_analysis: Json | null;
          application_status: string;
          status: string;
          score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          cv_id?: string | null;
          template_id?: string | null;
          template_key?: string;
          title: string;
          company_name?: string | null;
          job_title?: string | null;
          job_description?: string | null;
          hiring_manager?: string | null;
          company_website?: string | null;
          company_location?: string | null;
          tone?: string | null;
          length?: string | null;
          content?: Json;
          job_analysis?: Json | null;
          application_status?: string;
          status?: string;
          score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["cover_letters"]["Insert"]
        >;
        Relationships: [];
      };
      ai_generations: {
        Row: {
          id: string;
          user_id: string;
          cv_id: string | null;
          cover_letter_id: string | null;
          feature: string;
          model: string | null;
          input_ref: string | null;
          output_ref: string | null;
          input_tokens: number | null;
          output_tokens: number | null;
          status: string;
          error_code: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          cv_id?: string | null;
          cover_letter_id?: string | null;
          feature: string;
          model?: string | null;
          input_ref?: string | null;
          output_ref?: string | null;
          input_tokens?: number | null;
          output_tokens?: number | null;
          status?: string;
          error_code?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["ai_generations"]["Insert"]
        >;
        Relationships: [];
      };
      cv_ai_analyses: {
        Row: {
          id: string;
          user_id: string;
          cv_id: string;
          analysis_type: "cv_health" | "job_match";
          job_description_hash: string | null;
          result: Json;
          model: string | null;
          cv_updated_at: string;
          input_tokens: number | null;
          output_tokens: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          cv_id: string;
          analysis_type: "cv_health" | "job_match";
          job_description_hash?: string | null;
          result?: Json;
          model?: string | null;
          cv_updated_at: string;
          input_tokens?: number | null;
          output_tokens?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["cv_ai_analyses"]["Insert"]
        >;
        Relationships: [];
      };
      ai_usage: {
        Row: {
          id: string;
          user_id: string;
          period_start: string;
          period_end: string;
          generation_count: number;
          input_tokens: number;
          output_tokens: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          period_start: string;
          period_end: string;
          generation_count?: number;
          input_tokens?: number;
          output_tokens?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["ai_usage"]["Insert"]>;
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type?: string;
          title: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["notifications"]["Insert"]
        >;
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: string;
          status: string;
          provider: string;
          provider_customer_id: string | null;
          provider_subscription_id: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan?: string;
          status?: string;
          provider?: string;
          provider_customer_id?: string | null;
          provider_subscription_id?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["subscriptions"]["Insert"]
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_cv_owner: { Args: { p_cv_id: string }; Returns: boolean };
      is_experience_owner: {
        Args: { p_experience_id: string };
        Returns: boolean;
      };
      is_education_owner: {
        Args: { p_education_id: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

/** Convenience aliases used by later phases */
export type Profile = Tables<"profiles">;
export type Cv = Tables<"cvs">;
export type WorkExperience = Tables<"work_experiences">;
export type Education = Tables<"educations">;
export type EducationSubject = Tables<"education_subjects">;
export type CoverLetter = Tables<"cover_letters">;
export type UserTemplateCustomization = Tables<"user_template_customizations">;
export type Template = Tables<"templates">;
export type Subscription = Tables<"subscriptions">;
