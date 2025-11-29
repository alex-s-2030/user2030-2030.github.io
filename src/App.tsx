import { Route, Router, Switch, useLocation } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Overview } from "@/pages/Overview";
import { Dashboard } from "@/pages/Dashboard";
import { Regional } from "@/pages/Regional";
import { Insights } from "@/pages/Insights";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.3
};

function AppContent() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Handle GitHub Pages SPA redirect
    const redirect = sessionStorage.getItem('redirect');
    if (redirect) {
      sessionStorage.removeItem('redirect');
      setLocation(redirect);
    }
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1">
            <AnimatePresence mode="wait">
              <Switch>
                <Route path="/">
                  {() => (
                    <motion.div
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Overview />
                    </motion.div>
                  )}
                </Route>
                <Route path="/dashboard">
                  {() => (
                    <motion.div
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Dashboard />
                    </motion.div>
                  )}
                </Route>
                <Route path="/regional">
                  {() => (
                    <motion.div
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Regional />
                    </motion.div>
                  )}
                </Route>
                <Route path="/insights">
                  {() => (
                    <motion.div
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Insights />
                    </motion.div>
                  )}
                </Route>
                <Route>
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
                    className="min-h-screen bg-background flex items-center justify-center"
                  >
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
                      <p className="text-muted-foreground mb-8">Sorry, this page doesn't exist.</p>
                      <a 
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                      >
                        Go Home
                      </a>
                    </div>
                  </motion.div>
                </Route>
              </Switch>
            </AnimatePresence>
          </main>
          <Footer />
          <Toaster />
        </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router base="/">
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}

export default App;