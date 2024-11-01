/* global chrome */

import { Box, Button, Chip } from "@mui/material";
import React, { useState, useEffect } from "react";
import { getChrome } from "./chromeUtils";

const Overview = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [canonical, setCanonical] = useState("");
  const [keywords, setKeywords] = useState([]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: () => {
            const title = document.title;
            const descriptionMetaTag =
              document.querySelector(
                "meta[name='description'], meta[property='description']"
              ) ||
              document.querySelector(
                "meta[name='Description'], meta[property='Description']"
              ) ||
              document.querySelector(
                "meta[name='desc'], meta[property='desc']"
              ) ||
              document.querySelector(
                "meta[name='Desc'], meta[property='Desc']"
              );

            const description = descriptionMetaTag
              ? descriptionMetaTag?.getAttribute("content")
              : "";

            const url =
              document
                .querySelector("meta[name='og:url'], meta[property='og:url']")
                ?.getAttribute("content") || window.location.href;

            const canonical = document
              .querySelector("link[rel='canonical']")
              ?.getAttribute("href");

            const getKeywords =
              document.querySelector("meta[name='keywords']") ||
              document.querySelector("meta[name='keyword']");

            const keywords = getKeywords?.getAttribute("content");

            return { title, description, url, canonical, keywords };
          },
        },
        (results) => {
          console.log("Script results:", results); // Check the results structure
          if (results && results[0] && results[0].result) {
            const { title, description, url, canonical, keywords } =
              results[0].result;
            setTitle(title);
            setDescription(description);
            setUrl(url);
            setCanonical(canonical);
            setKeywords(
              keywords ? keywords.split(",").map((kw) => kw.trim()) : []
            );
          }
        }
      );
    });
  }, []);

  return (
    <>
      <Box>
        <Box
          className="title"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box className="title-left" sx={{ width: "50%" }}>
            <h2>Title</h2>
          </Box>
          <Box className="title-right">
            <Button
              variant="contained"
              color={title?.length > 65 ? "error" : "success"}
            >
              {title?.length} Characters
            </Button>
          </Box>
        </Box>
        <p>{title?.length > 0 ? title : "No title found"}</p>
      </Box>

      <Box>
        <Box
          className="title"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box className="title-left" sx={{ width: "50%" }}>
            <h2>Description</h2>
          </Box>
          <Box className="title-right">
            <Button
              variant="contained"
              color={description?.length > 160 ? "error" : "success"}
            >
              {description?.length} Characters
            </Button>
          </Box>
        </Box>
        <p>{description?.length > 0 ? description : "No description found"}</p>
      </Box>

      <Box>
        <Box
          className="title"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box className="title-left" sx={{ width: "50%" }}>
            <h2>URL</h2>
          </Box>
          <Box className="title-right">
            <Button variant="contained" color="success">
              {url?.length} Characters
            </Button>
          </Box>
        </Box>
        <p>{url?.length > 0 ? url : "No url found"}</p>
      </Box>

      <Box>
        <Box
          className="title"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box className="title-left" sx={{ width: "50%" }}>
            <h2>Canonical</h2>
          </Box>
        </Box>
        <p>{canonical?.length > 0 ? canonical : "No canonical tag found"}</p>
      </Box>

      <Box>
        <h2>Keywords</h2>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {console.log("hehehehe", keywords)}
          {keywords?.length > 0
            ? keywords?.map((keyword, index) => (
                <Chip key={index} label={keyword} variant="outlined" />
              ))
            : "No keywords found"}
        </Box>
      </Box>
    </>
  );
};

export default Overview;
