/* global chrome */

import { Box, Chip } from "@mui/material";
import React, { useEffect, useState } from "react";

const Schema = () => {
  const [schemas, setSchemas] = useState([]);
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: () => {
            const schemaMarkups = document.querySelectorAll(
              'script[type="application/ld+json"]'
            );

            let existedSchemas = [];
            for (let script of schemaMarkups) {
              const jsonData = JSON.parse(script.innerHTML);
              if (jsonData["@type"]) {
                existedSchemas?.push(jsonData);
              }

              if (jsonData["@graph"]) {
                console.log("heeheheh", script);
                existedSchemas?.push(...jsonData["@graph"]);
              }
            }

            console.log("heeheheh", existedSchemas);

            return { existedSchemas };
          },
        },
        (results) => {
          console.log("Script results:", results);
          if (results && results[0] && results[0].result) {
            const { existedSchemas } = results[0].result;
            setSchemas(existedSchemas);
          }
        }
      );
    });
  }, []);

  return (
    <>
      <Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {schemas?.length > 0
            ? schemas?.map((schema) => (
                <Chip label={schema["@type"]} variant="outlined" />
              ))
            : "No schema found"}
        </Box>
      </Box>
    </>
  );
};

export default Schema;
