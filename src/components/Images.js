/* global chrome */

import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";

const Images = () => {
  const [images, setImages] = useState([]);
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: () => {
            const images = document.querySelectorAll("img");

            let imagesData = [];
            for (let image in images) {
              imagesData.push({
                link: images[image].src,
                text: images[image].alt,
              });
            }

            return { imagesData };
          },
        },
        (results) => {
          console.log("Script results:", results); // Check the results structure
          if (results && results[0] && results[0].result) {
            const { imagesData } = results[0].result;
            setImages(imagesData);
          }
        }
      );
    });
  }, []);

  return (
    <>
      <Box sx={{ padding: 3 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <List sx={{ padding: 0 }}>
            {images?.length > 0
              ? images.map((item, index) => (
                  <ListItem key={index} sx={{ padding: "4px 0" }}>
                    <Typography variant="body1" sx={{ marginRight: 1 }}>
                      {index + 1}.
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        marginRight: 1,
                        fontSize: "12px",
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                      }}
                    >
                      <strong>{item?.link ? item?.link : null} :- </strong>{" "}
                      {item?.text ? item?.text : null}
                    </Typography>
                  </ListItem>
                ))
              : "No image found"}
          </List>
        </Box>
      </Box>
    </>
  );
};

export default Images;
