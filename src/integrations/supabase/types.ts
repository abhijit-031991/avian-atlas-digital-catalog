export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      "10001": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10101": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10102": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10103": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10104": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10105": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10106": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10107": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10108": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10201": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10301": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10302": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10303": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10304": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10305": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10306": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10307": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10308": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10309": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10310": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10311": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10312": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10313": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10314": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10315": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10316": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10317": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10318": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10319": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10320": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10331": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10334": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10336": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10338": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10339": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10340": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10343": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10345": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10353": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10354": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10355": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10356": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10357": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10358": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10359": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10360": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10362": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10372": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10373": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10374": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10376": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10398": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10399": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10401": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10402": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10403": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10404": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10405": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10406": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10407": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10408": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10409": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10410": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10411": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10412": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10413": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10414": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "10415": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "11111": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20001": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20002": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20003": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20004": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20005": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20006": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20007": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20008": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20009": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20010": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20011": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20012": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20013": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20014": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20015": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20016": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20017": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20051": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20054": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20072": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20074": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20103": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20104": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20105": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20106": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20131": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20132": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20133": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20151": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "20152": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "22222": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
      "99999": {
        Row: {
          activity: boolean | null
          ax: number | null
          ay: number | null
          az: number | null
          count: number
          created_at: string | null
          hdop: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid: number
          satellites: number | null
          speed: number | null
          timestamp: number
        }
        Insert: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count: number
          created_at?: string | null
          hdop?: number | null
          id: number
          latitude: number
          locktime: number
          longitude: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp: number
        }
        Update: {
          activity?: boolean | null
          ax?: number | null
          ay?: number | null
          az?: number | null
          count?: number
          created_at?: string | null
          hdop?: number | null
          id?: number
          latitude?: number
          locktime?: number
          longitude?: number
          pointid?: number
          satellites?: number | null
          speed?: number | null
          timestamp?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_device_table: { Args: { device_id: string }; Returns: undefined }
      create_table_dynamic: {
        Args: { table_name: string; table_schema: string }
        Returns: Json
      }
      exec_sql: { Args: { sql: string }; Returns: string }
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
