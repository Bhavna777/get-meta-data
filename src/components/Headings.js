/* global chrome */

import { Box, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";

const Headings = () => {
  const [headings, setHeadings] = useState([]);
  const [filter, setFilter] = useState("All");
  const [isSequenced, setIsSequenced] = useState(true); // Controls sorting order

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: () => {
            const getHeadings = [
              ...document.querySelectorAll("h1, h2, h3, h4, h5, h6"),
            ];

            const headingsData = getHeadings.map((heading) => [
              heading.tagName,
              heading.textContent,
            ]);

            return { headingsData };
          },
        },
        (results) => {
          if (results && results[0] && results[0].result) {
            const { headingsData } = results[0].result;
            setHeadings(headingsData);
          }
        }
      );
    });
  }, []);

  const handleFilterChange = (tag) => setFilter(tag);
  const toggleSequence = () => setIsSequenced((prev) => !prev);

  const filteredHeadings =
    filter === "All" ? headings : headings.filter((h) => h[0] === filter);

  // Sort headings if "Unsequence" is active
  const displayedHeadings = isSequenced
    ? filteredHeadings
    : [...filteredHeadings].sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <>
      <Box>
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 1,
            backgroundColor: "#dbf0fd",
            borderRadius: "20px",
            padding: "8px",
            marginBottom: "20px",
          }}
        >
          {["All", "H1", "H2", "H3", "H4", "H5", "H6"].map((tag) => (
            <Box
              key={tag}
              onClick={() => handleFilterChange(tag)}
              sx={{
                backgroundColor: filter === tag ? "#005BB5" : "#007FFF",
                color: "white",
                padding: "5px 10px",
                margin: "3px",
                borderRadius: "8px",
                cursor: "pointer",
                textAlign: "center",
                minWidth: "45px",
                fontSize: "0.875rem",
                "@media (max-width: 600px)": {
                  padding: "4px 8px",
                  fontSize: "0.75rem",
                },
              }}
            >
              <Typography>{tag}</Typography>
            </Box>
          ))}
        </Box>

        {filter === "All" ? (
          <Box
            onClick={toggleSequence}
            sx={{
              maxWidth: "150px",
              backgroundColor: "#009688",
              color: "white",
              padding: "5px 10px",
              margin: "3px",
              borderRadius: "8px",
              cursor: "pointer",
              textAlign: "center",
              fontSize: "0.875rem",
            }}
          >
            <Typography>{isSequenced ? "Sequence" : "Unsequence"}</Typography>
          </Box>
        ) : (
          ""
        )}

        <Box sx={{ marginTop: "20px" }}>
          {displayedHeadings.length > 0 ? (
            displayedHeadings.map(([tag, text], index) => (
              <Typography key={index}>
                <strong>{tag} :- </strong> {text}
              </Typography>
            ))
          ) : (
            <Typography>No headings found</Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Headings;
