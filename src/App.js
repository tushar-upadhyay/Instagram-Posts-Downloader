import {
  TextField,
  Button,
  Container,
  Icon,
  CircularProgress
} from "@material-ui/core";
import { Instagram } from "@material-ui/icons";
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import "./styles.css";

export default function App() {
  const styles = useStyles();
  const [url, setUrl] = useState("");
  const [error, setError] = useState(null);
  const [link, setLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  async function click(e) {
    e.preventDefault();

    let _url = url;
    setUrl("");
    if (!_url.startsWith("https://www.instagram.com")) {
      if (_url.startsWith("www.instagram.com")) {
        _url += "https://";
      } else {
        return setError("Please Enter correct Url");
      }
    }
    let data = _url.split("/");
    _url = `https://${data[2]}/${data[3]}/${data[4]}`;
    try {
      setIsLoading(true);
      let res = await fetch(_url + "/?__a=1");
      res = await res.json();
      let _link = res["graphql"]["shortcode_media"]["video_url"];
      console.log(_link);
      setLink(_link);
    } catch (err) {
      console.log(err);
      setError("Some Error Occured");
    }

    setIsLoading(false);
  }
  return (
    <Container
      style={{
        display: "flex",
        height: "100%",
        flex: 1,
        textAlign: "center",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <div className={styles.root}>
        <div className={styles.header}>
          <Instagram style={{ fontSize: 60 }} color="secondary" />
          <h2>Instagram Posts Downloader</h2>
        </div>
        <form className={styles.textF} onSubmit={click}>
          <div className={styles.flex}>
            <TextField
              required={true}
              value={url}
              error={error == null ? false : true}
              helperText={error}
              onFocus={() => {
                setLink(null);
                setError(null);
              }}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste Instagram post url"
            ></TextField>
            {isLoading ? (
              <CircularProgress style={{ marginTop: 10 }} />
            ) : (
              <Button
                style={{ marginTop: 10 }}
                color="primary"
                variant="contained"
                type="submit"
              >
                Go!
              </Button>
            )}
            {error == null ? (
              link == null ? (
                <div />
              ) : (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    style={{ marginTop: 30 }}
                    color="secondary"
                    variant="contained"
                  >
                    Download File!
                  </Button>
                </a>
              )
            ) : (
              <h3>{error}</h3>
            )}
          </div>
        </form>
      </div>
      <div>
        <h4>Note:Only posts of public Instagram Accounts are downloaded</h4>
      </div>
    </Container>
  );
}
const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    marginTop: 50
  },
  flex: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  header: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center"
  },
  textF: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200
    }
  }
}));
