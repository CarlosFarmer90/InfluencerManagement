import { useEffect, useState } from "react";

export default function Dashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const loadDashboard = async () => {
            const response = await fetch(
                "http://localhost:4000/dashboard"
            );

            const data = await response.json();

            setStats(data);
        };

        loadDashboard();
    }, []);

    if (!stats) {
        return <p>Cargando dashboard...</p>;
    }

    return (
        <div
            style={{
                width: "95%",
                maxWidth: "1400px",
                margin: "0 auto",
                padding: "20px",
            }}
        >
            <h1>Dashboard</h1>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "20px",
                    marginTop: "20px",
                }}
            >
                {/* General Stats */}
                <DashboardCard
                    title="Total Influencers"
                    value={stats.totalInfluencers}
                />

                <DashboardCard
                    title="Instagram Profiles"
                    value={stats.instagramProfiles}
                />

                <DashboardCard
                    title="Facebook Profiles"
                    value={stats.facebookProfiles}
                />

                <DashboardCard
                    title="TikTok Profiles"
                    value={stats.tiktokProfiles}
                />

                <DashboardCard
                    title="Instagram Followers"
                    value={formatFollowers(
                        stats.totalInstagramFollowers
                    )}
                />

                <DashboardCard
                    title="Facebook Followers"
                    value={formatFollowers(
                        stats.totalFacebookFollowers
                    )}
                />

                <DashboardCard
                    title="TikTok Followers"
                    value={formatFollowers(
                        stats.totalTikTokFollowers
                    )}
                />
            </div>

            {/* Top 10 Influencers by Followers */}
            <div
                style={{
                    marginTop: "40px",
                }}
            >
                <h2>
                    Top 10 Influencers by Followers
                </h2>

                <div
                    style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        padding: "20px",
                        backgroundColor: "white",
                        boxShadow:
                            "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                >
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            tableLayout: "fixed",
                        }}
                    >
                        <thead>
                            <tr>
                                <th
                                    style={{
                                        textAlign: "center",
                                        padding: "10px",
                                        width: "10%",
                                        border: "1px solid black",
                                    }}
                                >
                                    #
                                </th>

                                <th
                                    style={{
                                        textAlign: "center",
                                        padding: "10px",
                                        width: "60%",
                                        border: "1px solid black",
                                    }}
                                >
                                    Influencer
                                </th>

                                <th
                                    style={{
                                        textAlign: "right",
                                        padding: "10px",
                                        width: "30%",
                                        border: "1px solid black",
                                    }}
                                >
                                    Total Followers
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {stats.topInfluencers.map(
                                (
                                    influencer,
                                    index
                                ) => (
                                    <tr
                                        key={
                                            influencer.id
                                        }
                                    >
                                        <td
                                            style={{
                                                padding: "10px",
                                                border: "1px solid #e5e7eb",
                                            }}
                                        >
                                            {index + 1}
                                        </td>

                                        <td
                                            style={{
                                                padding: "10px",
                                                border: "1px solid #e5e7eb",
                                            }}
                                        >
                                            {
                                                influencer.nombre
                                            }
                                        </td>

                                        <td
                                            style={{
                                                padding: "10px",
                                                border: "1px solid #e5e7eb",
                                                textAlign: "right",
                                            }}
                                        >
                                            {formatFollowers(
                                                influencer.totalFollowers
                                            )}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Influencers by Category */}
            <div
                style={{
                    marginTop: "40px",
                }}
            >
                <h2>
                    Influencers by Category
                </h2>

                <div
                    style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        padding: "20px",
                        backgroundColor: "white",
                        boxShadow:
                            "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                >
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            tableLayout: "fixed",
                        }}
                    >
                        <thead>
                            <tr>
                                <th
                                    style={{
                                        textAlign: "left",
                                        padding: "10px",
                                        width: "75%",
                                        border: "1px solid black",
                                    }}
                                >
                                    Categoría
                                </th>

                                <th
                                    style={{
                                        textAlign: "right",
                                        padding: "10px",
                                        width: "25%",
                                        border: "1px solid black",
                                    }}
                                >
                                    Influencers
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {Object.entries(
                                stats.categoryCounts
                            )
                                .sort(
                                    (a, b) =>
                                        b[1] - a[1]
                                )
                                .map(
                                    (
                                        [category, count]
                                    ) => (
                                        <tr
                                            key={category}
                                        >
                                            <td
                                                style={{
                                                    padding: "10px",
                                                    textAlign: "left",
                                                    border: "1px solid #e5e7eb",
                                                }}
                                            >
                                                {category}
                                            </td>

                                            <td
                                                style={{
                                                    padding: "10px",
                                                    textAlign: "right",
                                                    border: "1px solid #e5e7eb",
                                                }}
                                            >
                                                {count}
                                            </td>
                                        </tr>
                                    )
                                )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Influencers without Social Media Handles */}
            <div
                style={{
                    marginTop: "40px",
                }}
            >
                <h2>
                    Data Quality
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "20px",
                        marginTop: "20px",
                    }}
                >
                    <DashboardCard
                        title="Without Agency"
                        value={
                            stats.influencersWithoutAgency
                        }
                    />

                    <DashboardCard
                        title="Without Email"
                        value={
                            stats.influencersWithoutEmail
                        }
                    />

                    <DashboardCard
                        title="Without Instagram"
                        value={
                            stats.influencersWithoutInstagram
                        }
                    />

                    <DashboardCard
                        title="Without Facebook"
                        value={
                            stats.influencersWithoutFacebook
                        }
                    />

                    <DashboardCard
                        title="Without TikTok"
                        value={
                            stats.influencersWithoutTikTok
                        }
                    />
                </div>
            </div>
        </div>

    );
}

function formatFollowers(value) {
    if (!value) {
        return "0";
    }

    if (value >= 1000000) {
        return (
            (value / 1000000).toFixed(1)
                .replace(".0", "") + "M"
        );
    }

    if (value >= 1000) {
        return (
            (value / 1000).toFixed(1)
                .replace(".0", "") + "K"
        );
    }

    return value.toLocaleString();
}

function DashboardCard({
    title,
    value,
}) {
    return (
        <div
            style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "20px",
                boxShadow:
                    "0 2px 4px rgba(0,0,0,0.1)",
                backgroundColor: "white",
            }}
        >
            <h3
                style={{
                    marginBottom: "10px",
                }}
            >
                {title}
            </h3>

            <div
                style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "#2563eb",
                }}
            >
                {value}
            </div>
        </div>
    );
}