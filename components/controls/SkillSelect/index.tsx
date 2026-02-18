"use client";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { Autocomplete, Checkbox, Chip, TextField, Box } from "@mui/material";
import * as React from "react";

import { type SkillId, type Skill, allSkills } from "./SkillRegistery";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type SkillSelectProps = {
  value: SkillId[];
  onChangeAction: (value: SkillId[]) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
  onBlurAction?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  name?: string;
  disabled?: boolean;
};

export default function SkillSelect({
  value,
  onChangeAction,
  label = "Select skills",
  error,
  helperText,
  onBlurAction,
  name,
  disabled,
}: SkillSelectProps) {
  const selectedOptions = React.useMemo<Skill[]>(
    () => allSkills.filter((s) => value.includes(s.id)),
    [value],
  );

  return (
    <Autocomplete
      readOnly={disabled}
      multiple
      options={allSkills}
      disableCloseOnSelect
      value={selectedOptions}
      getOptionLabel={(o) => o.label}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      onChange={(_, newOpts) => onChangeAction(newOpts.map((o) => o.id))}
      renderOption={(props, option, { selected }) => {
        const { key, ...rest } = props;
        return (
          <li
            key={key}
            {...rest}
            className="
            bg-gray-100
            border-b border-gray-200
            p-2
            flex items-center gap-2
          "
          >
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              checked={selected}
              sx={{
                p: 0,
                mr: 1,
                alignSelf: "center",
              }}
              slotProps={{
                input: {
                  "aria-label": option.label,
                },
              }}
            />

            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                lineHeight: 1,
              }}
            >
              <span aria-hidden className="inline-flex items-center">
                <span className="inline-flex items-center shrink-0 [svg]:w-5 [svg]:h-5">
                  {option.render()}
                </span>
              </span>

              <span className="text-gray-900">{option.label}</span>
            </Box>
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={error}
          helperText={helperText}
          name={name}
          onBlur={onBlurAction}
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: selectedOptions.map((option) => (
                <Chip
                  key={option.id}
                  label={option.label}
                  sx={{ m: 1, pt: 3, pb: 3 }}
                  onDelete={
                    disabled
                      ? undefined
                      : () => onChangeAction(value.filter((id) => id !== option.id))
                  }
                  icon={<span style={{ display: "inline-flex" }}>{option.render()}</span>}
                />
              )),
            },
          }}
        />
      )}
    />
  );
}
