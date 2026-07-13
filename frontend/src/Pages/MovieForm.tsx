import { useForm } from "react-hook-form";

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


interface FormValues {
  title: string;
  certificate: string;
  languages: string;  
  duration: string;
  releaseDate: string;
  description: string;
  genres: string;  
  bannerImage: string;
  backgroundImage: string;
}

const toCsv =   (arr?:string[]) => arr?.join(", ") ?? "";
const fromCsv = (csv: string) =>
  csv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export default function MovieForm({
  initialValues,
  submitLabel,
  isSubmitting,
  onSubmit,
}: MovieFormProps) {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      title: initialValues?.title ?? "",
      certificate: initialValues?.certificate ?? "U",
      languages: toCsv(initialValues?.languages),
      duration: initialValues?.duration ?? "",
      releaseDate: initialValues?.releaseDate ?? "",
      description: initialValues?.description ?? "",
      genres: toCsv(initialValues?.genres),
      bannerImage: initialValues?.bannerImage ?? "",
      backgroundImage: initialValues?.backgroundImage ?? "",
    },
  });

  const submit = (values: FormValues) => {
    onSubmit({
      ...values,
      languages: fromCsv(values.languages),
      genres: fromCsv(values.genres),
    });
  };

  const inputClass =
    "mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500";

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          {...register("title", { required: true })}
          className={inputClass}
          placeholder="Movie title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Certificate</label>
        <select {...register("certificate")} className={inputClass}>
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
        <input {...register("languages")} className={inputClass} placeholder="English, Hindi" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Duration</label>
        <input {...register("duration")} className={inputClass} placeholder="2h 05m" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Release Date</label>
        <input type="date" {...register("releaseDate")} className={inputClass} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register("description")}
          rows={3}
          className={`${inputClass} [&::-webkit-scrollbar]:hidden`}
          placeholder="Short description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Genres (comma-separated)
        </label>
        <input {...register("genres")} className={inputClass} placeholder="Action, Sci-Fi" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Banner Image URL</label>
        <input
          {...register("bannerImage")}
          className={`${inputClass} pr-5`}
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Background Image URL
        </label>
        <input
          {...register("backgroundImage")}
          className={`${inputClass} pr-5`}
          placeholder="https://..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 p-2 block bg-violet-600 disabled:opacity-50 text-white text-lg w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 cursor-pointer"
      >
        {submitLabel}
      </button>
    </form>
  );
}