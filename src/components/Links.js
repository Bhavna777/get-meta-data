/* global chrome */

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Links = () => {
  const [internalLinks, setInternalLinks] = useState([]);
  const [externalLinks, setExternalLists] = useState([]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: () => {
            const url =
              document
                .querySelector("meta[name='og:url'], meta[property='og:url']")
                ?.getAttribute("content") || window.location.href;

            const links = [...document.querySelectorAll("a")];
            internalLinks = [];
            externalLinks = [];

            var newUrl = new URL(url);

            var domain = newUrl.hostname;

            links.map((l) => {
              let linkUrl = l.href;
              console.log("heheh", linkUrl);
              let text = l.text;
              if (!linkUrl.includes(domain)) {
                externalLinks.push({ text: text, linkUrl: linkUrl });
              } else {
                internalLinks.push({ text: text, linkUrl: linkUrl });
              }
            });

            return { internalLinks, externalLinks };
          },
        },
        (results) => {
          if (results && results[0] && results[0].result) {
            const { internalLinks, externalLinks } = results[0].result;
            setInternalLinks(internalLinks);
            setExternalLists(externalLinks);
          }
        }
      );
    });
  }, []);

  return (
    <>
      <Box>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{
              backgroundColor: "#dbf0fd",
            }}
          >
            Internal Links - {internalLinks?.length}
          </AccordionSummary>
          <AccordionDetails>
            {internalLinks?.length > 0
              ? internalLinks.map(({ text, linkUrl }, index) => (
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
                      <strong> {text ? text : null} :- </strong>{" "}
                      {linkUrl ? linkUrl : null}
                    </Typography>
                  </ListItem>
                ))
              : "No internal links found"}
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ marginTop: "20px" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
            sx={{
              backgroundColor: "#dbf0fd",
            }}
          >
            External Links - {externalLinks?.length}
          </AccordionSummary>
          <AccordionDetails>
            {externalLinks?.length > 0
              ? externalLinks.map(({ text, linkUrl }, index) => (
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
                      <strong> {text ? text : null} :- </strong>{" "}
                      {linkUrl ? linkUrl : null}
                    </Typography>
                  </ListItem>
                ))
              : "No external links found"}
          </AccordionDetails>
        </Accordion>

        {/* <Typography>Internal Links :- {internalLinks?.length}</Typography>
        <Typography>External Links :- {externalLinks?.length}</Typography> */}
      </Box>
    </>
  );
};

export default Links;
