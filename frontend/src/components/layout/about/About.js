import React from "react";
import "./About.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';

const About = () => {
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://lh3.googleusercontent.com/a-/AFdZucr8WGcuM8ahVck7yjjxzlEiDyBXToE8mK3zysYzFg=s360-p-rw-no"
              alt="Founder"
            />
            <Typography>Arindam raina</Typography>
            <a
              style={{ textDecoration: "none" }}
              href="https://www.linkedin.com/in/arindam-raina-97638a203/"
              target="_blank"
            >
              <Button color="primary">Visit Linkedin</Button>
            </a>
            <span>
              This is a sample wesbite made by me as a practicee project. <br/>This website was made with assistance of <a style={{ textDecoration: "none" }} href="https://www.youtube.com/channel/UCO7afj9AUo0zV69pqEYhcjw">6 pack programmer</a>Youtube channel.
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">My handles</Typography>
            <a
              href="https://www.linkedin.com/in/arindam-raina-97638a203/"
              target="blank"
            >
              <LinkedInIcon className="youtubeSvgIcon" />
            </a>

            <a href="https://instagram.com/h2o_noob" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>

            <a href="https://confident-wiles-cac02f.netlify.app/" target="blank">
              <LibraryBooksOutlinedIcon className="portfolioSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
