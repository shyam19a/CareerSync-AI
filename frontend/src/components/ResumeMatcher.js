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

      // Resume
      if (resumeFile) formData.append("resume_file", resumeFile);
      else formData.append("resume_text", resumeText);

      // Job description
      if (jobFile) formData.append("job_file", jobFile);
      else formData.append("job_description", jobText);

      const { data } = await axios.post(
        `${API_BASE_URL}/match-file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResults(data);
      setOpenDialog(true);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          "An error occurred"
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

        <TextField
          fullWidth
          multiline
          minRows={5}
          margin="normal"
          label="Or paste resume text"
          value={resumeText}
          disabled={resumeFile !== null}
          onChange={(e) => {
            setResumeText(e.target.value);
            setResumeFile(null);
          }}
        />

        <Typography sx={{ color: "#ffe09a", fontWeight: 600, mt: 2 }}>
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

        <TextField
          fullWidth
          multiline
          minRows={5}
          margin="normal"
          label="Or paste job description"
          value={jobText}
          disabled={jobFile !== null}
          onChange={(e) => {
            setJobText(e.target.value);
            setJobFile(null);
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "ANALYZE"}
        </Button>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>
            Analysis Results
            <IconButton
              onClick={handleClose}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
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
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
