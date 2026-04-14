import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// ── Upload Cloud Icon ─────────────────────────────────────────────────────────
function UploadIcon({ active, dragging }) {
  return (
    <svg
      width="48"
      height="48"
      fill="none"
      viewBox="0 0 24 24"
      className={`transition-all duration-300 ${
        active
          ? "stroke-emerald-400"
          : dragging
          ? "stroke-white"
          : "stroke-white/50"
      }`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    </svg>
  );
}

// ── CSV File Icon ─────────────────────────────────────────────────────────────
function FileIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="stroke-emerald-400">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

// ── Check Icon ────────────────────────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="stroke-emerald-400">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
    </svg>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
      className="inline-block w-4 h-4 rounded-full border-[2.5px] border-white/20 border-t-white"
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Upload({ handleUrl, handleData }) {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedFileData, setUploadedFileData] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const validateAndSet = (f) => {
    if (!f) return;
    const validTypes = ["text/csv", "application/vnd.ms-excel"];
    if (!validTypes.includes(f.type)) {
      toast.error("Only CSV files are supported", { id: "bad-format" });
      return;
    }
    setFile(f);
    toast.success("File selected!", { id: "file-ok" });
  };

  const handleFileChange = (e) => validateAndSet(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    validateAndSet(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { toast.error("Please select a file first"); return; }
    const fd = new FormData();
    fd.append("file", file);
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/docs/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadedFileData(res.data);
      handleData(res.data);
      toast.success("File uploaded successfully!");
      navigate("/test-chat");
    } catch (err) {
      toast.error(err.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <AnimatePresence mode="wait">
          {uploadedFileData ? (
            /* ── Success card ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="rounded-3xl border border-white/20 bg-white/[0.10] backdrop-blur-2xl p-10 shadow-[0_24px_64px_rgba(0,0,0,0.7)] text-center"
            >
              {/* Green ring */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="mx-auto mb-6 w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center"
              >
                <CheckIcon />
              </motion.div>

              <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
                Upload Successful
              </h2>
              <p className="text-sm text-white/50 mb-1">File ready for analysis</p>
              <p className="text-xs text-white/30 truncate max-w-xs mx-auto mb-8 font-mono">
                {uploadedFileData.fileName}
              </p>

              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (handleUrl) handleUrl(uploadedFileData.path, uploadedFileData.fileId);
                  navigate("");
                }}
                className="w-full py-3.5 rounded-2xl font-semibold text-sm bg-emerald-500 hover:bg-emerald-400 text-white transition-colors duration-200 shadow-[0_0_24px_rgba(52,211,153,0.3)] cursor-pointer"
              >
                Analyse Data →
              </motion.button>
            </motion.div>
          ) : (
            /* ── Upload card ── */
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="rounded-3xl border border-white/20 bg-white/[0.10] backdrop-blur-2xl shadow-[0_24px_64px_rgba(0,0,0,0.7)] overflow-hidden"
            >
              {/* Card body */}
              <div className="px-6 pt-6 pb-4">
                {/* Title */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-white tracking-tight leading-tight">
                    Upload your CSV
                  </h1>
                  <p className="text-sm text-white/45 mt-1">
                    Drop a file below or click to browse — we'll take care of the rest.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* ── Drop zone ── */}
                  <label
                    htmlFor="file-upload"
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={[
                      "relative flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 select-none",
                      file
                        ? "border-emerald-500/60 bg-emerald-500/[0.07]"
                        : dragOver
                        ? "border-white/60 bg-white/[0.07] scale-[1.01]"
                        : "border-white/20 bg-white/[0.03] hover:border-white/35 hover:bg-white/[0.05]",
                    ].join(" ")}
                  >
                    {file ? (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-3"
                      >
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                          <FileIcon />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-emerald-400 max-w-[220px] truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-emerald-400/50 mt-0.5">
                            {(file.size / 1024).toFixed(1)} KB · Click to change
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${dragOver ? "bg-white/10" : "bg-white/[0.05]"}`}>
                          <UploadIcon active={false} dragging={dragOver} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-white/70">
                            <span className="font-semibold text-white">Click to upload</span>
                            {" "}or drag &amp; drop
                          </p>
                          <p className="text-xs text-white/35 mt-0.5">CSV files up to 10 MB</p>
                        </div>
                      </div>
                    )}
                    <input
                      id="file-upload"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>

                  {/* ── File info pill (when selected) ── */}
                  <AnimatePresence>
                    {file && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.09] text-xs text-white/50 overflow-hidden"
                      >
                        <span className="font-mono truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="shrink-0 text-white/30 hover:text-white/70 transition-colors cursor-pointer text-base leading-none"
                        >
                          ✕
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Submit button ── */}
                  <motion.button
                    type="submit"
                    disabled={loading || !file}
                    whileHover={!loading && file ? { scale: 1.02, y: -1 } : {}}
                    whileTap={!loading && file ? { scale: 0.98 } : {}}
                    className={[
                      "w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200",
                      file && !loading
                        ? "bg-white text-[#0a0a0a] cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_4px_28px_rgba(255,255,255,0.25)]"
                        : "bg-white/10 text-white/30 cursor-not-allowed",
                    ].join(" ")}
                  >
                    {loading ? (
                      <>
                        <Spinner />
                        <span>Uploading…</span>
                      </>
                    ) : (
                      "Continue →"
                    )}
                  </motion.button>
                </form>

                {/* Footer hint */}
                <p className="text-center text-[11px] text-white/20 mt-5">
                  Supported format: <span className="text-white/40 font-medium">.csv</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}