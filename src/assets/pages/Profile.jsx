import React, { useEffect, useState } from "react";
import { supabase } from "../../supabse/supabase.client";
import { useNavigate } from "react-router-dom";
import useAuth from "../components/UseAuth";
import Loading from "../components/Loading";


function Profile() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [editing, setEditing] = useState(false);

  // local state for inputs
  const [fullNameInput, setFullNameInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");

  // redirect if no user
    useEffect(() => {
    if (!loading) {       // <--- wait until loading is finished
        if (!user) {
        navigate("/signIn", { replace: true });
        }
    }
    }, [user, loading, navigate]);


  // fetch profile
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        const { data, error } = await supabase
          .from("user")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error && error.code === "PGRST116") {
          // no profile exists, create one
          const newFullName = user.email.split("@")[0] || "user";
          const newUsername = `user_${user.id.slice(0, 8)}`;

          const { data: newProfile, error: newProfileError } = await supabase
            .from("user")
            .insert({
              id: user.id,
              username: newUsername,
              full_name: newFullName,
              Avatar_url: null,
            })
            .select()
            .single();

          if (newProfileError) {
            console.error("Couldn't create profile:", newProfileError.message || newProfileError);
            setProfile(null);
          } else {
            setProfile(newProfile);
            console.log("New profile created:", newProfile);
          }
        } else if (error) {
          console.error("Failed to fetch profile:", error.message || error);
          setProfile(null);
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setProfile(null);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user]);

  // logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/signIn", { replace: true });
  };

  // save edited profile
  const handleSave = async () => {
    try {
      const { data, error } = await supabase
        .from("user")
        .update({
          full_name: fullNameInput,
          username: usernameInput,
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        console.error("Failed to update profile:", error);
        return;
      }

      setProfile(data);
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  // cancel edit
  const handleCancel = () => {
    setFullNameInput(profile?.full_name || "");
    setUsernameInput(profile?.username || "");
    setEditing(false);
  };

  // initialize input state when profile loads
  useEffect(() => {
    if (profile) {
      setFullNameInput(profile.full_name);
      setUsernameInput(profile.username);
    }
  }, [profile]);

//   making user profile Image
const handleImageUpload =async (e)=>{
    const file = e.target.files[0];
    if(!file || !user){
        console.log("upload the image");
        
        return;
    }
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = fileName;

    const {data,error} = await supabase.storage
    .from("profile_avatar")
    .upload(filePath,file,{
        upsert:true,
    })
    if(error){
        return console.error("failed to add upload the image ",error);
        
    }
    // getting the url
    const {data:public_Url} = supabase.storage.from("profile_avatar").getPublicUrl(filePath);
    const AvatarUrl = public_Url.publicUrl;
    console.log(AvatarUrl);
    

    console.log("added the image ",data, "and the image is:",file);
    const {error:updatingTheImg} = await supabase
    .from("user")
    .update({Avatar_url:AvatarUrl})
    .eq("id",user.id)

    if(error){
        return console.log("failed to update the image",updatingTheImg);
        
    }

    console.log("added the profile image sucsess");
    window.location.reload();


      

    

}






  if (loading || loadingProfile)
    return <Loading/>;

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center md:text-left">
          Profile
        </h1>

        <div className="bg-zinc-800 rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center md:w-1/3">
            <img
              src={profile?.Avatar_url || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-cyan-400 mb-4"
            />
            <label
            htmlFor="profileImg"
            className="text-sm text-cyan-400 hover:underline cursor-pointer"
            >
            Change image
            </label>

            <input
            id="profileImg"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            />

          </div>

          {/* Info */}
          <div className="flex-1 space-y-6">
            {/* Full Name */}
            <div>
              <p className="text-zinc-400 text-sm">Full Name</p>
              {editing ? (
                <input
                  className="w-full p-2 rounded bg-zinc-900 text-zinc-100 border border-zinc-700 focus:ring-2 focus:ring-cyan-400"
                  value={fullNameInput}
                  onChange={(e) => setFullNameInput(e.target.value)}
                />
              ) : (
                <p className="text-lg font-medium">{profile?.full_name?? "Your name"}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <p className="text-zinc-400 text-sm">Username</p>
              {editing ? (
                <input
                  className="w-full p-2 rounded bg-zinc-900 text-zinc-100 border border-zinc-700 focus:ring-2 focus:ring-cyan-400"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                />
              ) : (
                <p className="text-lg font-medium">@{profile?.username?? "user"}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <p className="text-zinc-400 text-sm">Email</p>
              <p className="text-lg font-medium">{user?.email || "—"}</p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-cyan-500 text-zinc-900 py-3 rounded-lg font-semibold hover:bg-cyan-400 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 border border-zinc-500 text-zinc-400 py-3 rounded-lg hover:bg-zinc-700 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="flex-1 bg-cyan-500 text-zinc-900 py-3 rounded-lg font-semibold hover:bg-cyan-400 transition"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 border border-red-500 text-red-400 py-3 rounded-lg font-semibold hover:bg-red-500 hover:text-zinc-900 transition"
                  >
                    Log Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
