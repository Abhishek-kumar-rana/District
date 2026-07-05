/**
 * Movie Schema
 * {
 *   id: Number                (auto-generated)
 *   title: String             (required)
 *   certificate: String       e.g. "U", "UA7+", "UA13+", "UA16+", "A"
 *   languages: [String]
 *   duration: String          e.g. "2h 05m"
 *   releaseDate: String       "YYYY-MM-DD"
 *   description: String
 *   genres: [String]
 *   bannerImage: String       (URL)
 *   backgroundImage: String   (URL)
 *   cast: [CastMember]
 * }
 *
 * CastMember Schema
 * {
 *   id: Number
 *   name: String
 *   role: String
 *   image: String (URL)
 * }
 */

function validateMovieInput(body, { isUpdate = false } = {}) {
  const errors = [];

  if (!isUpdate || body.title !== undefined) {
    if (!body.title || typeof body.title !== "string") {
      errors.push("'title' is required and must be a string.");
    }
  }

  if (body.languages !== undefined && !Array.isArray(body.languages)) {
    errors.push("'languages' must be an array of strings.");
  }

  if (body.genres !== undefined && !Array.isArray(body.genres)) {
    errors.push("'genres' must be an array of strings.");
  }

  if (body.cast !== undefined && !Array.isArray(body.cast)) {
    errors.push("'cast' must be an array of cast member objects.");
  }

  return errors;
}

module.exports = { validateMovieInput };
