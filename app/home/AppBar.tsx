"use client";

import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useMemo, useCallback, useRef } from "react";

import HideOnScroll from "@/components/HideOnScroll";
import { useWebsiteData } from "@/context/WebsiteData";

function normalizeId(label: string) {
  return label.toLowerCase().replace(/\s/g, "");
}

export default function PortfolioAppBar() {
  const { data } = useWebsiteData();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const appBarRef = useRef<HTMLDivElement | null>(null);
  const mobileBarRef = useRef<HTMLDivElement | null>(null);

  const pages = useMemo(() => {
    const pagesWithContent: string[] = [];
    if (data.aboutMe) pagesWithContent.push("About Me");
    if (data.skills?.length) pagesWithContent.push("Skills");
    if ((data.education?.length ?? 0) > 0 || (data.experiences?.length ?? 0) > 0) {
      pagesWithContent.push("Education And Experience");
    }
    if (data.projects?.length) pagesWithContent.push("Projects");
    return pagesWithContent;
  }, [data]);

  const handleOpenNavMenu = () => {
    setAnchorElNav(mobileBarRef.current);
  };
  const handleCloseNavMenu = () => setAnchorElNav(null);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;

    const headerH = appBarRef.current?.offsetHeight ?? 0;
    const rect = el.getBoundingClientRect();
    const targetY = rect.top + window.scrollY - headerH - 8;

    window.scrollTo({ top: targetY, behavior: "smooth" });
  }, []);

  return (
    <HideOnScroll threshold={16}>
      <AppBar position="sticky" sx={{ background: "none" }} ref={appBarRef}>
        <Container
          maxWidth="xl"
          sx={{
            px: { xs: 0, sm: 0, md: 2, lg: 2 },
            overflowX: "hidden",
          }}
        >
          <Toolbar disableGutters sx={{ display: { xs: "block", sm: "block", md: "flex" } }}>
            <Box
              ref={mobileBarRef}
              sx={{
                flexGrow: 1,
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                backgroundColor: "rgba(12,12,16,0.82)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                color: "rgba(255,255,255,0.92)",
                px: 1,
                width: "100%",
                mx: 0,
                overflowX: "hidden",
                borderBottom: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <IconButton
                size="large"
                aria-label="mobile app bar"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                sx={{
                  color: "rgba(255,255,255,0.92)",
                  "& .MuiSvgIcon-root": { fontSize: 28 },
                  "&.MuiIconButton-root:focus": { outline: "none" },
                }}
              >
                <MenuIcon />
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                keepMounted
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                marginThreshold={0}
                sx={{ display: { xs: "block", md: "none" } }}
                slotProps={{
                  list: { sx: { p: 0, m: 0 } },
                  paper: {
                    sx: {
                      left: "0 !important",
                      width: "100vw",
                      maxWidth: "100vw",
                      backgroundColor: "rgba(18,18,24,0.92)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderTop: "none",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                      color: "rgba(255,255,255,0.92)",
                    },
                  },
                }}
              >
                {pages.map((page) => {
                  const id = normalizeId(page);
                  return (
                    <MenuItem
                      key={page}
                      onClick={() => {
                        handleCloseNavMenu();
                        setTimeout(() => scrollToSection(id), 0);
                      }}
                      sx={{
                        py: 1,
                        px: 2,
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.06)" },
                      }}
                    >
                      <Typography
                        component="h3"
                        variant="caption"
                        sx={{
                          textAlign: "center",
                          color: "rgba(255,255,255,0.92)",
                          letterSpacing: 0.2,
                        }}
                      >
                        {page}
                      </Typography>
                    </MenuItem>
                  );
                })}
              </Menu>
            </Box>

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
                    <Typography component="h3" variant="button" fontWeight="bold" color="white">
                      {page}
                    </Typography>
                  </Button>
                );
              })}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
}
