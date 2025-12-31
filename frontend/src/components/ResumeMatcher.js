import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function ResumeMatcher() {
  const [resumeText, setResumeText] = useState("");
  const [jobText, setJobText] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [jobFile, setJobFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);
    setError("");

    try {
      const formData = new FormData();

      if (resumeFile) formData.append("resume_file", resumeFile);
      else formData.append("resume_text", resumeText);

      if (jobFile) formData.append("job_file", jobFile);
      else formData.append("job_description", jobText);

      const { data } = await axios.post(
        `${API_BASE_URL}/match-file`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResults(data);
      setOpenDialog(true);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          "Something went wrong"
      );
    }

    setLoading(false);
  };

  const handleClose = () => setOpenDialog(false);

  const fileInputStyle = { display: "none" };

  const prettyInputBtn = {
    marginBottom: "0.5em",
    background: "linear-gradient(90deg,#e5c185 0%, #f7e0b6 100%)",
    color: "#191715",
    borderRadius: 20,
    fontWeight: 600,
    padding: "7px 19px",
    cursor: "pointer",
    border: "none",
    fontSize: "1em",
    boxShadow: "0px 2px 18px rgba(229,193,133,0.15)",
    display: "inline-block",
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      width="100vw"
      sx={{ backgroundColor: "black" }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: 500,
          maxWidth: "95vw",
          bgcolor: "#000",
          borderRadius: 6,
          p: 4,
          border: "2px solid #e5c185",
          boxShadow: "0 0 40px rgba(229,193,133,0.2)",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          mb={3}
          sx={{
            background:
              "linear-gradient(90deg,#fff0cc 0%,#e5bc60 50%,#a17323 98%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 900,
            letterSpacing: "3px",
          }}
        >
          AI Resume & Job Matcher
        </Typography>

        {/* Resume */}
        <Typography sx={{ color: "#ffe09a", fontWeight: 600 }}>
          Upload or Paste Resume
        </Typography>

        <label style={prettyInputBtn}>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            style={fileInputStyle}
            onChange={(e) => {
              setResumeFile(e.target.files[0]);
              setResumeText("");
            }}
          />
          Choose Resume File
        </label>

        <Typography
          sx={{
            mb: 2,
            color: resumeFile ? "#e5c185" : "#aaa",
            fontWeight: resumeFile ? "bold" : "normal",
          }}
        >
          {resumeFile ? resumeFile.name : "No file selected"}
        </Typography>

        <TextField
          fullWidth
          multiline
          minRows={5}
          label="Or paste resume text"
          value={resumeText}
          disabled={resumeFile !== null}
          onChange={(e) => {
            setResumeText(e.target.value);
            if (e.target.value) setResumeFile(null);
          }}
          sx={{
            background: "#111",
            textarea: { color: "#fff" },
            label: { color: "#bc9a43" },
          }}
        />

        {/* Job */}
        <Typography sx={{ color: "#ffe09a", fontWeight: 600, mt: 3 }}>
          Upload or Paste Job Description
        </Typography>

        <label style={prettyInputBtn}>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            style={fileInputStyle}
            onChange={(e) => {
              setJobFile(e.target.files[0]);
              setJobText("");
            }}
          />
          Choose Job File
        </label>

        <Typography
          sx={{
            mb: 2,
            color: jobFile ? "#e5c185" : "#aaa",
            fontWeight: jobFile ? "bold" : "normal",
          }}
        >
          {jobFile ? jobFile.name : "No file selected"}
        </Typography>

        <TextField
          fullWidth
          multiline
          minRows={5}
          label="Or paste job description"
          value={jobText}
          disabled={jobFile !== null}
          onChange={(e) => {
            setJobText(e.target.value);
            if (e.target.value) setJobFile(null);
          }}
          sx={{
            background: "#111",
            textarea: { color: "#fff" },
            label: { color: "#bc9a43" },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3, fontWeight: "bold" }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "ANALYZE"}
        </Button>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {/* Results Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleClose}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              backgroundColor: "#000",
              color: "#fff",
              border: "2px solid #e5c185",
              borderRadius: 4,
            },
          }}
        >
          <DialogTitle sx={{ color: "#e5c185", fontWeight: "bold" }}>
            Analysis Results
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "#e5c185",
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent
            dividers
            sx={{ backgroundColor: "#000", color: "#fff" }}
          >
            <Typography>
              Similarity Score: {results?.similarity_score}
            </Typography>

            <Typography mt={2}>Missing Skills:</Typography>
            <Typography>
              {results?.missing_skills?.join(", ") || "None"}
            </Typography>

            <Typography mt={2}>Suggestions:</Typography>
            <ul>
              {results?.suggestions?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={handleClose}
              sx={{ color: "#e5c185", fontWeight: "bold" }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
