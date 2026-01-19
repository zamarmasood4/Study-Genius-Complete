import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import UserHistory from '@/components/UserHistory';
import { useToast } from "@/components/ui/use-toast";
import { Camera, Settings, History, User, Key, AtSign, Loader, ExternalLink } from 'lucide-react';
import { apiService } from '@/services/api';

const Profile = () => {
  const [activeTab, setActiveTab] = useState("settings");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // User data state
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profileImage: null
  });

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Summaries state
  const [summaries, setSummaries] = useState([]);
  const [summariesLoading, setSummariesLoading] = useState(false);

  // Load user profile on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getProfile();
        
        if (response.success) {
          const user = response.user;
          const profilePicture = user.profile_picture || user.user_metadata?.profile_picture;
          
          setUserData({
            name: user.full_name || user.user_metadata?.full_name || user.email.split('@')[0],
            email: user.email,
            profileImage: profilePicture
          });
          
          setProfileForm({
            name: user.full_name || user.user_metadata?.full_name || user.email.split('@')[0],
            email: user.email
          });
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        toast({
          title: "Error loading profile",
          description: "Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [toast]);

  // Load summaries when history tab is active - Only show recent 5
  useEffect(() => {
    const loadSummaries = async () => {
      if (activeTab === "history") {
        try {
          setSummariesLoading(true);
          const response = await apiService.getUserSummaries();
          
          if (response.success) {
            // Check if there's a message about missing table
            if (response.message && response.message.includes("table")) {
              // Table doesn't exist yet - show empty state
              setSummaries([]);
              console.log("Summaries table not found:", response.message);
            } else {
              // Transform the API response to match your component's expected format
              const formattedSummaries = response.summaries
                .map(summary => ({
                  id: summary.id,
                  title: summary.title,
                  content: summary.content,
                  source_type: summary.source_type,
                  created_at: summary.created_at,
                  key_points: summary.source_text ? 
                    summary.source_text.split('\n').filter(point => point.trim()) : 
                    []
                }))
                // Sort by creation date (newest first) and take only 5
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 5);
              
              setSummaries(formattedSummaries);
            }
          }
        } catch (error) {
          console.error('Failed to load summaries:', error);
          // Set empty summaries on error
          setSummaries([]);
        } finally {
          setSummariesLoading(false);
        }
      }
    };

    loadSummaries();
  }, [activeTab]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await apiService.updateProfile(profileForm.name);
      
      if (response.success) {
        setUserData({
          ...userData,
          name: profileForm.name
        });
        
        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully.",
        });
        
        // Reload profile to get updated data
        const profileResponse = await apiService.getProfile();
        if (profileResponse.success) {
          const user = profileResponse.user;
          setUserData(prev => ({
            ...prev,
            name: user.full_name || user.user_metadata?.full_name || user.email.split('@')[0]
          }));
        }
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: "Error updating profile",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your new passwords match.",
        variant: "destructive"
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);

    try {
      const response = await apiService.changePassword(
        passwordForm.currentPassword, 
        passwordForm.newPassword
      );
      
      if (response.success) {
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        
        toast({
          title: "Password updated",
          description: "Your password has been changed successfully.",
        });
      }
    } catch (error) {
      console.error('Failed to change password:', error);
      toast({
        title: "Error changing password",
        description: error.message || "Please check your current password and try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsUpdating(true);
        
        // Upload to backend
        const response = await apiService.updateProfilePicture(file);
        
        if (response.success) {
          // Create local URL for immediate display
          const localUrl = URL.createObjectURL(file);
          
          setUserData({
            ...userData,
            profileImage: localUrl
          });
          
          toast({
            title: "Profile picture updated",
            description: "Your profile picture has been updated successfully.",
          });
          
          // Reload profile to get the actual URL from backend
          const profileResponse = await apiService.getProfile();
          if (profileResponse.success) {
            const user = profileResponse.user;
            const profilePicture = user.profile_picture || user.user_metadata?.profile_picture;
            if (profilePicture) {
              setUserData(prev => ({
                ...prev,
                profileImage: profilePicture
              }));
            }
          }
        }
      } catch (error) {
        console.error('Failed to upload profile picture:', error);
        toast({
          title: "Error uploading profile picture",
          description: error.message || "Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleProfileFormChange = (field, value) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordFormChange = (field, value) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleViewAllSummaries = () => {
    navigate('/summaries');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <div className="app-container py-8 flex justify-center items-center min-h-[60vh]">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="app-container py-8">
        <h1 className="text-3xl font-bold mb-2 gradient-text">User Profile</h1>
        <p className="text-muted-foreground mb-8">Manage your account settings and view your history</p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-2 max-w-md bg-muted rounded-xl p-1">
            <TabsTrigger value="settings" className="dashboard-tab">
              <Settings className="h-4 w-4" />
              <span className="ml-2">Profile Settings</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="dashboard-tab">
              <History className="h-4 w-4" />
              <span className="ml-2">User History</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Profile Image Section - Improved Design */}
              <div className="glass-card p-8 rounded-2xl col-span-1">
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative group">
                    {/* Square/Rounded Avatar with better image handling */}
                    <div className="w-40 h-40 rounded-2xl border-4 border-primary/20 overflow-hidden bg-muted/50 shadow-lg transition-all duration-300 group-hover:shadow-xl">
                      {userData.profileImage ? (
                        <img 
                          src={userData.profileImage} 
                          alt={userData.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                          <span className="text-4xl font-bold text-primary">
                            {userData.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Camera Button */}
                    <label 
                      htmlFor="profile-image" 
                      className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-3 rounded-full cursor-pointer hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-background"
                    >
                      <Camera className="h-5 w-5" />
                      <input 
                        id="profile-image" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                        disabled={isUpdating}
                      />
                    </label>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">{userData.name}</h2>
                    <p className="text-muted-foreground text-sm">{userData.email}</p>
                  </div>
                </div>
              </div>
              
              {/* Profile Forms Section */}
              <div className="glass-card p-8 rounded-2xl col-span-2 space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold flex items-center">
                    <User className="mr-3 h-6 w-6 text-primary" />
                    Personal Information
                  </h3>
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="grid gap-4">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-base font-medium">Full Name</Label>
                        <Input 
                          id="name" 
                          value={profileForm.name} 
                          onChange={(e) => handleProfileFormChange('name', e.target.value)}
                          disabled={isUpdating}
                          className="h-12 text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-base font-medium">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={profileForm.email} 
                          disabled
                          className="h-12 text-base bg-muted/50"
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isUpdating}
                      className="h-11 px-6 text-base"
                    >
                      {isUpdating ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </form>
                </div>
                
                {/* Change Password */}
                {/* <div className="space-y-6 pt-6 border-t border-border">
                  <h3 className="text-xl font-semibold flex items-center">
                    <Key className="mr-3 h-6 w-6 text-primary" />
                    Change Password
                  </h3>
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div className="grid gap-4">
                      <div className="space-y-3">
                        <Label htmlFor="current-password" className="text-base font-medium">Current Password</Label>
                        <Input 
                          id="current-password" 
                          type="password" 
                          value={passwordForm.currentPassword}
                          onChange={(e) => handlePasswordFormChange('currentPassword', e.target.value)}
                          disabled={isUpdating}
                          className="h-12 text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="new-password" className="text-base font-medium">New Password</Label>
                        <Input 
                          id="new-password" 
                          type="password" 
                          value={passwordForm.newPassword}
                          onChange={(e) => handlePasswordFormChange('newPassword', e.target.value)}
                          disabled={isUpdating}
                          className="h-12 text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="confirm-password" className="text-base font-medium">Confirm New Password</Label>
                        <Input 
                          id="confirm-password" 
                          type="password" 
                          value={passwordForm.confirmPassword}
                          onChange={(e) => handlePasswordFormChange('confirmPassword', e.target.value)}
                          disabled={isUpdating}
                          className="h-12 text-base"
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      variant="outline" 
                      disabled={isUpdating}
                      className="h-11 px-6 text-base"
                    >
                      {isUpdating ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin mr-2" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </form>
                </div> */}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="animate-fade-in">
            <div className="glass-card p-8 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center">
                  <AtSign className="mr-3 h-6 w-6 text-primary" />
                  Recent Summaries
                </h3>
                <span className="text-sm text-muted-foreground">
                  Showing {summaries.length} of recent summaries
                </span>
              </div>
              
              {summariesLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : summaries.length > 0 ? (
                <div className="space-y-6">
{summaries.map((summary, index) => (
  <UserHistory 
    key={summary.id || index} 
    summary={summary} 
    index={index}
    onUpdate={(updatedSummary) => {
      // Update the summary in the state to reflect changes immediately
      const updatedSummaries = [...summaries];
      updatedSummaries[index] = updatedSummary;
      setSummaries(updatedSummaries);
    }} 
  />
))}
                  
                  {/* View All Button */}
                  <div className="flex justify-center pt-4">
                    <Button 
                      onClick={handleViewAllSummaries}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      View All Summaries
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground space-y-3">
                  <p className="text-lg">No summaries found.</p>
                  <p className="text-sm">Your generated summaries will appear here.</p>
                  <Button 
                    onClick={() => navigate('/dashboard')}
                    variant="outline"
                    className="mt-4"
                  >
                    Create Your First Summary
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;