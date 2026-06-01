import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect, useRef } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UnlockProvider } from "./contexts/UnlockContext";
import Home from "./pages/Home";
import RayBanDisplayDS from "./pages/projects/RayBanDisplayDS";
import WearablesColorSystem from "./pages/projects/WearablesColorSystem";
import EMGHandwriting from "./pages/projects/EMGHandwriting";
import AISmartwatch from "./pages/projects/AISmartwatch";
import DSTooling from "./pages/projects/DSTooling";
import { scrollToTopImmediate } from "@/hooks/useSmoothScroll";
import PasswordGate from "./components/PasswordGate";

function ScrollToTop() {
  const [location] = useLocation();
  const isFirstMount = useRef(true);

  useEffect(() => {
    scrollToTopImmediate();
    const t1 = setTimeout(() => scrollToTopImmediate(), 0);
    const t2 = setTimeout(() => scrollToTopImmediate(), 50);
    const t3 = setTimeout(() => scrollToTopImmediate(), 100);

    // Only do the opacity flash on route *changes*, not on initial mount
    // (initial mount is handled by the PasswordGate / font-load reveal)
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }

    const root = document.getElementById('root');
    if (root) {
      root.style.transition = 'none';
      root.style.opacity = '0';
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          root.style.transition = 'opacity 180ms cubic-bezier(0.23, 1, 0.32, 1)';
          root.style.opacity = '1';
        });
      });
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
    <ScrollToTop />
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/project/rayban-display-ds"} component={RayBanDisplayDS} />
      <Route path={"/project/wearables-color-system"} component={WearablesColorSystem} />
      <Route path={"/project/emg-handwriting"} component={EMGHandwriting} />
      <Route path={"/project/ai-smartwatch"} component={AISmartwatch} />
      <Route path={"/project/ds-tooling"} component={DSTooling} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <UnlockProvider>
            <PasswordGate>
              <Router />
            </PasswordGate>
          </UnlockProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
