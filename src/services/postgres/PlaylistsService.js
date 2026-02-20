import pkg from "pg";
import config from "../../config/index.js";

const { Pool } = pkg;

class PlaylistsService {
  constructor() {
    this._pool = new Pool(config.postgres);
  }

  async getPlaylistExportById(playlistId) {
    const query = {
      text: `
        SELECT p.id,
               p.name,
               s.id AS song_id,
               s.title,
               s.performer
        FROM playlists p
               LEFT JOIN playlist_songs ps ON ps.playlist_id = p.id
               LEFT JOIN songs s ON s.id = ps.song_id
        WHERE p.id = $1
        ORDER BY ps.id ASC
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new Error("Playlist tidak ditemukan");
    }

    const songs = result.rows
      .filter((row) => row.song_id)
      .map((row) => ({
        id: row.song_id,
        title: row.title,
        performer: row.performer,
      }));

    return {
      playlist: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        songs,
      },
    };
  }

  async close() {
    await this._pool.end();
  }
}

export default PlaylistsService;
