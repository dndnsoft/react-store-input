export function serialize(value: unknown): unknown {
    if (value === undefined) {
        return undefined;
    }

    if (value === null) {
        return {
            type: "null",
            value: null,
        };
    }

    if (typeof value === "string") {
        return {
            type: "string",
            value,
        };
    }

    if (typeof value === "number") {
        return {
            type: "number",
            value,
        };
    }

    if (typeof value === "boolean") {
        return {
            type: "boolean",
            value,
        };
    }

    if (value instanceof Date) {
        return {
            type: "date",
            value: value.toISOString(),
        };
    }

    if (Array.isArray(value)) {
        return {
            type: "array",
            value: value.map((item) => serialize(item)),
        };
    }

    if (typeof value === "object") {
        return {
            type: "object",
            value: Object.entries(value).reduce((
                acc,
                [key, value]
            ): Record<string, unknown> => {
                return {
                    ...acc,
                    [key]: serialize(value),
                };
            }, {})
        };
    }

    return undefined;
};

export function deserialize(data: unknown): unknown {
    if (data === undefined) {
        return undefined;
    }

    if (typeof data === "object" && data !== null && "type" in data && "value" in data) {
        const { type, value } = data as {
            type: string;
            value: unknown;
        };

        switch (type) {
            case "null":
                return null;
            case "string":
                return value as string;
            case "number":
                return value as number;
            case "boolean":
                return value as boolean;
            case "date":
                return new Date(value as string);
            case "array":
                return (value as unknown[]).map((item) => deserialize(item));
            case "object":
                return Object.entries(value as Record<string, unknown>).reduce((
                    acc,
                    [key, value]
                ): Record<string, unknown> => {
                    return {
                        ...acc,
                        [key]: deserialize(value),
                    };
                }, {});
            default:
                return undefined;
        }
    }
    return undefined;
}
