export interface IGDBImage {
  image_id: string;
}

export interface IGDBTag {
  id: string | number;
  name: string;
}

export interface GameData {
  id: string | number;
  name: string;
  summary?: string;
  storyline?: string;
  first_release_date?: number;
  total_rating?: number;
  total_rating_count?: number;
  cover?: IGDBImage;
  artworks?: IGDBImage[];
  screenshots?: IGDBImage[];
  videos?: { video_id: string }[];
  genres?: IGDBTag[];
  themes?: IGDBTag[];
  platforms?: IGDBTag[];
  similar_games?: { id: string | number }[];
}
