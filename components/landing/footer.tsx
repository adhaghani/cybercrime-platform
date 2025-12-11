import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <ShieldAlert className="h-6 w-6 text-primary" />
              <span>SafeCampus</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Empowering our campus community to report and track safety incidents effectively. Together for a safer environment.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/crime" className="hover:text-primary">Crime Feed</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary">Dashboard</Link></li>
              <li><Link href="/auth/login" className="hover:text-primary">Login</Link></li>
              <li><Link href="/auth/sign-up" className="hover:text-primary">Sign Up</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">Safety Guidelines</Link></li>
              <li><Link href="#" className="hover:text-primary">Emergency Contacts</Link></li>
              <li><Link href="#" className="hover:text-primary">Support Services</Link></li>
              <li><Link href="#" className="hover:text-primary">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>UiTM Shah Alam</li>
              <li>40450 Shah Alam</li>
              <li>Selangor, Malaysia</li>
              <li><a href="mailto:support@uitm.edu.my" className="hover:text-primary">support@uitm.edu.my</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SafeCampus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
