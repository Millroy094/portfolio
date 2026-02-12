import AddIcon from "@mui/icons-material/Add";
import { Paper, Stack, Typography, Divider, Button, Box } from "@mui/material";
import * as React from "react";

type FormSectionProps = {
  title: string;
  description: string;
  addLabel: string;
  onAdd: () => void;
  count: number;
  children: React.ReactNode;
};

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  addLabel,
  onAdd,
  count,
  children,
}) => {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="h6">{title}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} size="small" onClick={onAdd}>
          {addLabel}
        </Button>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      {count > 0 ? (
        <Box>{children}</Box>
      ) : (
        <EmptyState
          title={`No ${title.toLowerCase()} yet`}
          description={description}
          actionLabel={addLabel}
          onAction={onAdd}
        />
      )}
    </Paper>
  );
};

const EmptyState: React.FC<{
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}> = ({ title, description, actionLabel, onAction }) => {
  return (
    <Stack
      spacing={1.5}
      alignItems="flex-start"
      sx={{
        p: 2,
        borderRadius: 1,
        border: "1px dashed",
        borderColor: (t) => t.palette.divider,
        backgroundColor: (t) =>
          t.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
      }}
    >
      <Typography variant="subtitle1">{title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
      <Button variant="outlined" startIcon={<AddIcon />} onClick={onAction}>
        {actionLabel}
      </Button>
    </Stack>
  );
};
