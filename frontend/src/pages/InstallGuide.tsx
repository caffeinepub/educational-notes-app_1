import { Smartphone, Monitor, Download, Home, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';

export default function InstallGuide() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
          <Download className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Install Memory Increase PWA
        </h1>
        <p className="text-lg text-muted-foreground">
          Install our app on your device for a better experience - works offline and launches like a native app!
        </p>
      </div>

      {/* Chrome Installation Guide */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            Chrome Browser Installation (Desktop & Mobile)
          </CardTitle>
          <CardDescription>
            Follow these simple steps to install Memory Increase on Chrome
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              1
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Find the Install Button</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Look for the install icon in Chrome's address bar (looks like a computer with a down arrow ⊕) or open the menu (three dots ⋮) and select "Install app" or "Add to Home screen".
              </p>
              <div className="bg-muted p-3 rounded-lg text-sm">
                <strong>Desktop:</strong> Install icon appears in the address bar on the right side
                <br />
                <strong>Mobile:</strong> Tap the menu (⋮) → "Add to Home screen" or "Install app"
              </div>
            </div>
          </div>

          <Separator />

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              2
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Click Install</h3>
              <p className="text-sm text-muted-foreground mb-2">
                A dialog box will appear asking if you want to install Memory Increase. Click "Install" to confirm.
              </p>
              <div className="bg-muted p-3 rounded-lg text-sm">
                The installation dialog shows the app name, icon, and permissions required.
              </div>
            </div>
          </div>

          <Separator />

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              3
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Add to Home Screen</h3>
              <p className="text-sm text-muted-foreground mb-2">
                After installation, the app icon will be added to your device:
              </p>
              <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-primary" />
                  <strong>Desktop:</strong> App appears in your applications menu and can be pinned to taskbar
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-primary" />
                  <strong>Mobile:</strong> App icon appears on your home screen like any other app
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Step 4 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              4
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Launch the App</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Click the Memory Increase icon to open the app. It will launch in its own window without browser controls, just like a native app!
              </p>
              <div className="bg-primary/10 p-3 rounded-lg text-sm flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Benefits:</strong> Faster loading, offline access, and a distraction-free experience!
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Troubleshooting Tips
          </CardTitle>
          <CardDescription>
            Common issues and how to fix them
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 text-sm">❓ Install button not appearing?</h3>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
              <li>Check if the app is already installed on your device</li>
              <li>Ensure you're using HTTPS (secure connection)</li>
              <li>Try refreshing the page (Ctrl+R or Cmd+R)</li>
              <li>Make sure you're using a compatible browser (Chrome, Edge, or Brave)</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2 text-sm">❓ Installation failing?</h3>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
              <li>Clear your browser cache and cookies</li>
              <li>Check if you have sufficient storage space on your device</li>
              <li>Update your browser to the latest version</li>
              <li>Try using an incognito/private window</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2 text-sm">❓ App not appearing on home screen?</h3>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
              <li>Check your app drawer or applications folder</li>
              <li>Restart your device to refresh the home screen</li>
              <li>On mobile, check if you need to manually add it from the app drawer</li>
              <li>Verify browser settings allow app installations</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2 text-sm">❓ App not working offline?</h3>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
              <li>Open the app at least once while online to cache resources</li>
              <li>Check your browser's site settings and ensure storage is allowed</li>
              <li>Some features may require an internet connection</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Benefits Card */}
      <Card className="mb-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <CardTitle>Why Install as PWA?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-1">Offline Access</h4>
                <p className="text-xs text-muted-foreground">
                  Play games even without internet connection
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-1">Faster Loading</h4>
                <p className="text-xs text-muted-foreground">
                  Instant startup with cached resources
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-1">Native Experience</h4>
                <p className="text-xs text-muted-foreground">
                  Runs in its own window like a native app
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-1">Easy Access</h4>
                <p className="text-xs text-muted-foreground">
                  Launch directly from home screen or taskbar
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Back Button */}
      <div className="text-center">
        <Button
          onClick={() => navigate({ to: '/' })}
          size="lg"
          className="gap-2"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}
