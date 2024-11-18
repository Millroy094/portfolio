import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Logo from "../assets/Informic.svg?react";
import { Link } from "react-scroll";

const pages = ["About Me", "Skills", "Education And Experience", "Projects"];

function PortfolioAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static" sx={{ background: "none" }}>
      <Container maxWidth="xl" sx={{ padding: { xs: "0" } }}>
        <Toolbar
          disableGutters
          sx={{ display: { xs: "block", sm: "block", md: "flex" } }}
        >
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              background: "white",
              width: "50px",
              height: "45px",
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
              marginRight: "20px",
            }}
          >
            <Link
              smooth
              duration={1000}
              delay={100}
              offset={0}
              to="introduction"
              spy
            >
              <Logo />
            </Link>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              background: "white",
              opacity: 0.8,
            }}
          >
            <IconButton
              size="large"
              aria-label="mobile app bar"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ "&.MuiIconButton-root:focus": { outline: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              style={{
                transform: "translateX(-18px) translateY(0px)",
              }}
              MenuListProps={{
                style: {
                  padding: 0,
                  margin: 0,
                },
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
                opacity: 0.8,
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page}>
                  <Link
                    smooth
                    spy
                    duration={1000}
                    delay={100}
                    to={page.toLowerCase().replace(/\s/g, "")}
                    onClick={handleCloseNavMenu}
                  >
                    <Typography
                      variant="caption"
                      sx={{ textAlign: "center", color: "black" }}
                    >
                      {page}
                    </Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
            <Box
              sx={{
                display: "flex",
                background: "white",
                width: "100%",
                height: "45px",
                overflow: "hidden",
                justifyContent: "center",
              }}
            >
              <Link smooth duration={1000} delay={100} spy to="introduction">
                <Logo />
              </Link>
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  "&.MuiButton-root:focus": { outline: "none" },
                }}
              >
                <Link
                  smooth
                  duration={1000}
                  delay={100}
                  spy
                  to={page.toLowerCase().replace(/\s/g, "")}
                  onClick={handleCloseNavMenu}
                >
                  <Typography variant="button" fontWeight="bold" color="white">
                    {page}
                  </Typography>
                </Link>
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default PortfolioAppBar;
