import { Github, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">About This Project</h3>
            <p className="text-sm text-muted-foreground">
              An interactive data visualization tool designed to help policymakers understand 
              mortality patterns and make evidence-based decisions to improve public health outcomes.
            </p>
          </div>

          {/* Data Sources */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Data & Methodology</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Mock data based on public health research</li>
              <li>• 20 countries across North America & Europe</li>
              <li>• Temporal data from 2010-2023</li>
              <li>• Evidence-based intervention models</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Connect</h3>
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              © 2024 Mortality Insights. For demonstration purposes.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}