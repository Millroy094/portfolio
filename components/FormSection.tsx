import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import {
  Paper,
  Stack,
  Typography,
  Divider,
  Button,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import * as React from "react";
import { useFormContext, useWatch, Path } from "react-hook-form";

import type { ProfileSchemaType } from "@/app/admin/AdminForm/schema";

type VisibilityKey = keyof NonNullable<ProfileSchemaType["visibility"]>;

type FormSectionProps = {
  title: string;
  description: string;
  addLabel?: string;
  onAdd?: () => void;
  count: number;
  children: React.ReactNode;
  disabled?: boolean;
  visKey?: VisibilityKey;
  showVisibilityToggle?: boolean;
  showAddButton?: boolean;
};

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  addLabel = "Add",
  onAdd,
  count,
  children,
  disabled,
  visKey,
  showVisibilityToggle = true,
  showAddButton = false,
}) => {
  const { control, setValue } = useFormContext<ProfileSchemaType>();

  const watchedVisible = useWatch({
    control,
    name: `visibility.${visKey ?? "avatar"}` as Path<ProfileSchemaType>,
  }) as boolean | undefined;

  const isVisible = visKey ? Boolean(watchedVisible) : true;

  const toggleVisibility = () => {
    if (!visKey) return;
    setValue(`visibility.${visKey}` as Path<ProfileSchemaType>, !isVisible, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        transition: "filter .2s ease, opacity .2s ease",
        ...(visKey && !isVisible ? { filter: "grayscale(1)", opacity: 0.8 } : undefined),
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6">{title}</Typography>

          {!isVisible && visKey && (
            <Chip
              size="small"
              variant="outlined"
              label="Hidden"
              icon={<VisibilityOffOutlinedIcon fontSize="small" />}
            />
          )}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          {visKey && showVisibilityToggle && (
            <Tooltip title={isVisible ? "Visible on public page" : "Hidden on public page"}>
              <IconButton
                onClick={toggleVisibility}
                color={isVisible ? "default" : "warning"}
                size="small"
                disabled={disabled}
              >
                {isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </Tooltip>
          )}

          {/* Optional Add button */}
          {showAddButton && onAdd && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="small"
              onClick={onAdd}
              disabled={disabled}
            >
              {addLabel}
            </Button>
          )}
        </Stack>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {/* Body */}
      {showAddButton ? (
        count > 0 ? (
          <Box component="fieldset" disabled={disabled} sx={{ p: 0, border: 0, m: 0 }}>
            {children}
          </Box>
        ) : (
          <EmptyState
            title={`No ${title.toLowerCase()} yet`}
            description={description}
            actionLabel={addLabel}
            onAction={onAdd!}
            disabled={disabled}
          />
        )
      ) : (
        // No empty state when no Add button
        <Box component="fieldset" disabled={disabled} sx={{ p: 0, border: 0, m: 0 }}>
          {children}
        </Box>
      )}
    </Paper>
  );
};

const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  disabled,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  disabled?: boolean;
}) => (
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
    <Button variant="outlined" startIcon={<AddIcon />} onClick={onAction} disabled={disabled}>
      {actionLabel}
    </Button>
  </Stack>
);
