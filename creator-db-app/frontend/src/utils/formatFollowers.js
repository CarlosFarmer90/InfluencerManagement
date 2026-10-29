export const formatFollowers = (count) => {
    if (!count) {
        return "";
    }

    if (count >= 1000000) {
        const value = count / 1000000;

        return `${parseFloat(
            value.toFixed(1)
        )}M`;
    }

    if (count >= 1000) {
        const value = count / 1000;

        return `${parseFloat(
            value.toFixed(1)
        )}K`;
    }

    return count.toString();
};