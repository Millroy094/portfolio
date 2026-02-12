import { Avatar, Grid, Skeleton } from "@mui/material";
import { useState } from "react";

type AvatarWithSkeletonProps = {
  data: {
    avatarUrl: string;
    fullName: string;
  };
};

export default function AvatarWithSkeleton(props: AvatarWithSkeletonProps) {
  const { data } = props;
  const { avatarUrl, fullName } = data;

  const [loaded, setLoaded] = useState(false);

  return (
    <Grid container justifyContent="center">
      {!loaded && (
        <Skeleton
          variant="circular"
          width={150}
          height={150}
          sx={{ position: "absolute" }}
        />
      )}

      <Avatar
        alt={fullName}
        src={avatarUrl}
        sx={{
          width: 150,
          height: 150,
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
        slotProps={{
          img: {
            onLoad: () => setLoaded(true),
            onError: () => setLoaded(true),
          },
        }}
      />
    </Grid>
  );
}
