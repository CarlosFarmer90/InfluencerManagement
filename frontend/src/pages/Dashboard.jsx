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
                        }}
                    >
                        <thead>
                            <tr>
                                <th
                                    style={{
                                        textAlign: "left",
                                        paddingBottom: "10px",
                                    }}
                                >
                                    #
                                </th>

                                <th
                                    style={{
                                        textAlign: "left",
                                        paddingBottom: "10px",
                                    }}
                                >
                                    Influencer
                                </th>

                                <th
                                    style={{
                                        textAlign: "right",
                                        paddingBottom: "10px",
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
                                                padding:
                                                    "8px 0",
                                            }}
                                        >
                                            {index + 1}
                                        </td>

                                        <td>
                                            {
                                                influencer.nombre
                                            }
                                        </td>

                                        <td
                                            style={{
                                                textAlign:
                                                    "right",
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