import { redirect } from "next/navigation";

// The "Research Protocol Bundles" feature (Fat Loss / Summer Shred, Sleep
// Optimization / Wired-and-Tired, Founder-CEO Focus, Muscle Building, 8-12
// week "programs") was a personal-outcome, duration-based product line --
// exactly the kind of human-use/biohacking framing that doesn't belong on
// a laboratory/analytical supplier catalog. Removed entirely rather than
// relabeled, since there's no legitimate lab-research reason to bundle
// compounds by a personal fitness/wellness outcome. Redirecting here
// rather than 404ing in case anything external still links to /bundles.
export default function BundlesPage() {
  redirect("/shop");
}
