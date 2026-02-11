"use client";

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
import { useWebsiteData } from "@/context/WebsiteData";
import { useMemo, useCallback, useRef } from "react";

function normalizeId(label: string) {
  return label.toLowerCase().replace(/\s/g, "");
}

export default function PortfolioAppBar() {
  const { data } = useWebsiteData();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );
  const appBarRef = useRef<HTMLDivElement | null>(null);

  const pages = useMemo(() => {
    const pagesWithContent: string[] = [];
    if (data.aboutMe) pagesWithContent.push("About Me");
    if (data.skills?.length) pagesWithContent.push("Skills");
    if (
      (data.education?.length ?? 0) > 0 ||
      (data.experiences?.length ?? 0) > 0
    ) {
      pagesWithContent.push("Education And Experience");
    }
    if (data.projects?.length) pagesWithContent.push("Projects");
    return pagesWithContent;
  }, [data]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => setAnchorElNav(null);

  // Native smooth scroll that accounts for AppBar height
  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;

    const headerH = appBarRef.current?.offsetHeight ?? 0;
    const rect = el.getBoundingClientRect();
    const targetY = rect.top + window.scrollY - headerH - 8; // -8 for a bit of breathing room

    window.scrollTo({ top: targetY, behavior: "smooth" });
  }, []);

  return (
    <AppBar position="fixed" sx={{ background: "none" }} ref={appBarRef}>
      <Container maxWidth="xl" sx={{ padding: { xs: 0, sm: 0, md: 2, lg: 2 } }}>
        <Toolbar
          disableGutters
          sx={{ display: { xs: "block", sm: "block", md: "flex" } }}
        >
          {/* Mobile */}
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
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              style={{ transform: "translateX(-18px) translateY(0px)" }}
              MenuListProps={{ style: { padding: 0, margin: 0 } }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" }, opacity: 0.8 }}
            >
              {pages.map((page) => {
                const id = normalizeId(page);
                return (
                  <MenuItem
                    key={page}
                    onClick={() => {
                      handleCloseNavMenu();
                      // Delay a tick so Menu can close before we measure and scroll
                      setTimeout(() => scrollToSection(id), 0);
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ textAlign: "center", color: "black" }}
                    >
                      {page}
                    </Typography>
                  </MenuItem>
                );
              })}
            </Menu>
          </Box>

          {/* Desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => {
              const id = normalizeId(page);
              return (
                <Button
                  key={page}
                  onClick={() => scrollToSection(id)}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    "&.MuiButton-root:focus": { outline: "none" },
                  }}
                >
                  <Typography variant="button" fontWeight="bold" color="white">
                    {page}
                  </Typography>
                </Button>
              );
            })}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
