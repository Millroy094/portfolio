"use client";

import * as React from "react";
import {
    Autocomplete,
    Checkbox,
    Chip,
    TextField,
    Box
} from "@mui/material";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

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
};

export default function SkillSelect({
                                        value,
                                        onChangeAction,
                                        label = "Select skills",
                                        error,
                                        helperText,
                                        onBlurAction,
                                        name
                                    }: SkillSelectProps) {

    const selectedOptions = React.useMemo<Skill[]>(
        () => allSkills.filter((s) => value.includes(s.id)),
        [value]
    );

    return (
        <Autocomplete
            multiple
            options={allSkills}
            disableCloseOnSelect
            value={selectedOptions}
            getOptionLabel={(o) => o.label}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            onChange={(_, newOpts) => onChangeAction(newOpts.map(o => o.id))}
            renderOption={(props, option, { selected }) => {
                const { key, ...rest } = props;
                return (
                    <li key={key} {...rest}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            sx={{ mr: 1 }}
                            checked={selected}
                        />
                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
                            <span aria-hidden>{option.render()}</span>
                            <span>{option.label}</span>
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
                                    sx={{ mr: 0.5 }}
                                    onDelete={() =>
                                        onChangeAction(value.filter((id) => id !== option.id))
                                    }
                                    icon={
                                        <span style={{ display: "inline-flex" }}>
                      {option.render()}
                    </span>
                                    }
                                />
                            ))
                        }
                    }}
                />
            )}
        />
    );
}