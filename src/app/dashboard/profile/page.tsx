import PageHeader from "@/components/dashboard/PageHeader";
import ProfileForm from "@/components/dashboard/ProfileForm";

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        title="Profile Settings"
        description="Update your name and profile picture."
      />
      <ProfileForm />
    </>
  );
}