
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
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/match";

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
    const formData = new FormData();
    if (resumeFile) formData.append("resume_file", resumeFile);
    else formData.append("resume_text", resumeText);
    if (jobFile) formData.append("job_file", jobFile);
    else formData.append("job_text", jobText);
    try {
      const { data } = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResults(data);
      setOpenDialog(true);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
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
    transition: "filter 0.3s, box-shadow 0.3s",
    boxShadow: "0px 2px 18px 0px rgba(229,193,133,0.15)",
    letterSpacing: 1.1,
    outline: "none",
    display: "inline-block",
  };

  return (
    <Box
      className="pro-bg"
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: 500,
          maxWidth: "95vw",
          bgcolor: "black",             // Changed to black background
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 32px 0 rgba(227,193,104,0.22)",
          borderRadius: 6,
          p: 4,
          border: "2.7px solid",
          borderImage: "linear-gradient(95deg, #e5c185 0%, #f7e0b6 100%) 1",
          animation: "fadeInUp 0.85s",
          transition: "box-shadow .25s, transform .22s",
          "&:hover": {
            boxShadow: "0 24px 85px 0 rgba(243,204,81,0.25), 0 3px 14px #ffe9bd29",
            transform: "translateY(-7px) scale(1.013)",
          },
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

        <Typography variant="subtitle1" gutterBottom sx={{ color: "#ffe09a", fontWeight: 600 }}>
          Upload or Paste your Resume:
        </Typography>
        <label style={prettyInputBtn}>
          <input
            type="file"
            accept=".pdf,.docx,.doc"
            style={fileInputStyle}
            onChange={(e) => setResumeFile(e.target.files[0])}
            tabIndex={-1}
          />
          Choose File
        </label>
        <Typography
          variant="body2"
          sx={{ mb: 2, color: "#fff", fontStyle: resumeFile ? "normal" : "italic" }}
        >
          {resumeFile ? resumeFile.name : "No file chosen"}
        </Typography>

        <TextField
          fullWidth
          minRows={6}
          label="Or paste resume text"
          variant="outlined"
          multiline
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          disabled={resumeFile !== null}
          margin="normal"
          sx={{
            borderRadius: 3,
            background: "#231e17",
            input: { color: "#fff" },
            textarea: { color: "#fff" },
          }}
          InputLabelProps={{ style: { color: "#bc9a43" } }}
        />

        <Typography variant="subtitle1" mt={3} gutterBottom sx={{ color: "#ffe09a", fontWeight: 600 }}>
          Upload or Paste Job Description:
        </Typography>
        <label style={prettyInputBtn}>
          <input
            type="file"
            accept=".pdf,.docx,.doc"
            style={fileInputStyle}
            onChange={(e) => setJobFile(e.target.files[0])}
            tabIndex={-1}
          />
          Choose File
        </label>
        <Typography
          variant="body2"
          sx={{ mb: 2, color: "#fff", fontStyle: jobFile ? "normal" : "italic" }}
        >
          {jobFile ? jobFile.name : "No file chosen"}
        </Typography>

        <TextField
          fullWidth
          minRows={6}
          label="Or paste job description"
          variant="outlined"
          multiline
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          disabled={jobFile !== null}
          margin="normal"
          sx={{
            borderRadius: 3,
            background: "#231e17",
            input: { color: "#fff" },
            textarea: { color: "#fff" },
          }}
          InputLabelProps={{ style: { color: "#bc9a43" } }}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 3,
            mb: 1,
            fontSize: "1.14em",
            fontWeight: "bold",
            background: "linear-gradient(90deg,#e5c185 0%,#a67c31 100%)",
            color: "#191715",
            borderRadius: 30,
            boxShadow: "0px 4.5px 28px 0px rgba(229,193,133,0.16)",
            transition: "background 0.22s, box-shadow 0.22s",
            "&:hover": {
              background:
                "linear-gradient(90deg,#fff0cc 5%,#f7e0b6 50%,#e5c185 100%)",
              boxShadow: "0px 7px 38px 0px rgba(229,193,133,0.29),0px 3px 17px #f7e0b640",
            },
          }}
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={23} sx={{ color: "#e5c185" }} /> : "ANALYZE"}
        </Button>

        {error && (
          <Typography color="error" sx={{ mt: 3, fontWeight: "bold" }}>
            {error}
          </Typography>
        )}

        {/* Dialog popup for results with black background & white text */}
        <Dialog 
          open={openDialog} 
          onClose={handleClose} 
          maxWidth="sm" 
          fullWidth 
          PaperProps={{ sx: { backgroundColor: "#000", color: "#fff" } }}
        >
          <DialogTitle sx={{ color: "#e5c185" }}>
            Analysis Results
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: "#e5c185",
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="h6" gutterBottom sx={{ color: "#fff" }}>
              Similarity Score: {Math.round(results?.similarity_score * 100)}%
            </Typography>
            <Typography variant="subtitle1" mt={2} sx={{ color: "#fff" }}>
              Your Skills Detected:
            </Typography>
            <Typography sx={{ color: "#ddd" }}>{results?.extracted_resume_skills.join(", ") || "None"}</Typography>
            <Typography variant="subtitle1" mt={2} sx={{ color: "#fff" }}>
              Job Requires:
            </Typography>
            <Typography sx={{ color: "#ddd" }}>{results?.extracted_job_skills.join(", ") || "None"}</Typography>
            <Typography variant="subtitle1" mt={2} sx={{ color: "#fff" }}>
              Missing Skills:
            </Typography>
            <Typography sx={{ color: "#ddd" }}>{results?.missing_skills.join(", ") || "None"}</Typography>
            <Typography variant="subtitle1" mt={2} sx={{ color: "#fff" }}>
              Suggestions:
            </Typography>
            <ul>
              {results?.suggestions?.map((s, i) => (
                <li key={i} style={{ color: "#ddd" }}>{s}</li>
              ))}
            </ul>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={{color: "#e5c185"}}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
