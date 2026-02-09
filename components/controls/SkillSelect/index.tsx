import * as React from "react";
import { Autocomplete, Checkbox, Chip, TextField, Box } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { type SkillId, type Skill, allSkills } from "./SkillRegistery";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type SkillSelectProps = {
    value: SkillId[];                     // expects array of ids
    onChange: (value: SkillId[]) => void; // returns array of ids
    label?: string;
    error?: boolean;
    helperText?: string;
    onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    name?: string; // provided by RHF
};

export default function SkillSelect({
                                        value,
                                        onChange,
                                        label = "Select skills",
                                        error,
                                        helperText,
                                        onBlur,
                                        name,
                                    }: SkillSelectProps) {
    // Map ids -> options
    const selectedOptions = React.useMemo<Skill[]>(
        () => allSkills.filter((s) => value?.includes(s.id)),
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
            onChange={(_, newOptions) => onChange(newOptions.map((o) => o.id))}
            renderOption={(props, option, { selected }) => (
                <li {...props} key={option.id}>
                    <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                    />
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
                        <span aria-hidden>{option.render()}</span>
                        <span>{option.label}</span>
                    </Box>
                </li>
            )}
            renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => {
                    const chipProps = getTagProps({ index });
                    const { key, ...restChipProps } = chipProps as { key: React.Key }; // key exists in chipProps
                    return (
                        <Chip
                            key={key}
                            {...restChipProps}
                            label={option.label}
                            icon={<span style={{ display: "inline-flex" }}>{option.render()}</span>}
                        />
                    );
                })
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    error={error}
                    helperText={helperText}
                    onBlur={onBlur}
                    name={name}
                />
            )}
        />
    );
}