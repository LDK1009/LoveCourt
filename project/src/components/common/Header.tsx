"use client";

import { AppBar, Toolbar, Typography, Button, styled, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import { mixinFlex } from "@/styles/mixins";
import { useAuthStore } from "@/store";
import { GavelRounded, PersonOutline, Menu as MenuIcon } from "@mui/icons-material";
import Link from "next/link";
import { useState } from "react";

const Header = () => {
  const { user } = useAuthStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar position="fixed" elevation={0}>
      <StyledToolbar>
        <LogoContainer>
          <IconButton component={Link} href="/" color="inherit">
            <GavelRounded />
          </IconButton>
          <Typography variant="h6" component={Link} href="/" sx={{ textDecoration: "none", color: "inherit" }}>
            연애재판
          </Typography>
        </LogoContainer>
        
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={handleMenuClick}
              edge="end"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem 
                component={Link} 
                href="/cases" 
                onClick={handleMenuClose}
              >
                사례 모음
              </MenuItem>
              <MenuItem 
                component={Link} 
                href="/case/new" 
                onClick={handleMenuClose}
              >
                새 사례 등록
              </MenuItem>
              {user.isSignIn ? (
                <MenuItem 
                  component={Link} 
                  href="/my-page" 
                  onClick={handleMenuClose}
                >
                  마이페이지
                </MenuItem>
              ) : (
                <MenuItem 
                  component={Link} 
                  href="/auth/sign-in" 
                  onClick={handleMenuClose}
                >
                  로그인
                </MenuItem>
              )}
            </Menu>
          </>
        ) : (
          <NavButtons>
            <Button color="inherit" component={Link} href="/cases">
              사례 모음
            </Button>
            <Button color="inherit" component={Link} href="/case/new">
              새 사례 등록
            </Button>
            {user.isSignIn ? (
              <Button 
                color="inherit" 
                startIcon={<PersonOutline />}
                component={Link} 
                href="/my-page"
              >
                마이페이지
              </Button>
            ) : (
              <Button 
                color="inherit" 
                component={Link} 
                href="/auth/sign-in"
              >
                로그인
              </Button>
            )}
          </NavButtons>
        )}
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Header;

const StyledAppBar = styled(AppBar)`
  background-color: ${({ theme }) => theme.palette.background.paper};
  color: ${({ theme }) => theme.palette.primary.main};
  border-bottom: 1px solid ${({ theme }) => theme.palette.gray[200]};
`;

const StyledToolbar = styled(Toolbar)`
  ${mixinFlex("row")};
  justify-content: space-between;
  padding: 0 16px;
`;

const LogoContainer = styled("div")`
  ${mixinFlex("row")};
  justify-content: flex-start;
  gap: 8px;
`;

const NavButtons = styled("div")`
  ${mixinFlex("row")};
  justify-content: flex-end;
  gap: 8px;
`; 