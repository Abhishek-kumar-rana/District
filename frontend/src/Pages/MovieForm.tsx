import { useState } from "react";
import type { FormEvent } from "react";

export interface MovieFormPayload {
  title: string;
  certificate: string;
  languages: string[];
  duration: string;
  releaseDate: string;
  description: string;
  genres: string[];
  bannerImage: string;
  backgroundImage: string;
}

interface MovieFormInitialValues {
  title?: string;
  certificate?: string;
  languages?: string[];
  duration?: string;
  releaseDate?: string;
  description?: string;
  genres?: string[];
  bannerImage?: string;
  backgroundImage?: string;
}

interface MovieFormProps {
  initialValues?: MovieFormInitialValues;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (payload: MovieFormPayload) => void;
}

// Simple, uncontrolled-by-libraries form. Languages/genres are entered as
// comma-separated text and converted to arrays on submit — keeps this
// component dependency-free (no react-hook-form/zod needed for a basic
// admin CRUD form).
export default function MovieForm({
  initialValues,
  submitLabel,
  isSubmitting,
  onSubmit,
}: MovieFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [certificate, setCertificate] = useState(initialValues?.certificate ?? "U");
  const [languages, setLanguages] = useState(
    initialValues?.languages?.join(", ") ?? ""
  );
  const [duration, setDuration] = useState(initialValues?.duration ?? "");
  const [releaseDate, setReleaseDate] = useState(initialValues?.releaseDate ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [genres, setGenres] = useState(initialValues?.genres?.join(", ") ?? "");
  const [bannerImage, setBannerImage] = useState(initialValues?.bannerImage ?? "");
  const [backgroundImage, setBackgroundImage] = useState(
    initialValues?.backgroundImage ?? ""
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      certificate,
      languages: languages
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      duration,
      releaseDate,
      description,
      genres: genres
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      bannerImage,
      backgroundImage,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Movie title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Certificate</label>
        <select
          value={certificate}
          onChange={(e) => setCertificate(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="U">U</option>
          <option value="UA7+">UA7+</option>
          <option value="UA13+">UA13+</option>
          <option value="UA16+">UA16+</option>
          <option value="A">A</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Languages (comma-separated)
        </label>
        <input
          value={languages}
          onChange={(e) => setLanguages(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="English, Hindi"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Duration</label>
        <input
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="2h 05m"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Release Date</label>
        <input
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Short description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Genres (comma-separated)
        </label>
        <input
          value={genres}
          onChange={(e) => setGenres(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Action, Sci-Fi"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Banner Image URL</label>
        <input
          value={bannerImage}
          onChange={(e) => setBannerImage(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Background Image URL
        </label>
        <input
          value={backgroundImage}
          onChange={(e) => setBackgroundImage(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 p-2 block bg-violet-400 disabled:opacity-50 text-white text-lg w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500"
      >
        {submitLabel}
      </button>
    </form>
  );
}