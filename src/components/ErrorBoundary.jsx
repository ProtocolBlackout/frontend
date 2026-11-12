/**
 * Diese ErrorBoundary-Komponente dient als Sicherheitsnetz für die Anwendung.
 *
 * Was sie macht:
 * Sollte in den darin enthaltenen Komponenten ein Fehler auftreten, fängt sie
 * diesen ab und verhindert, dass die gesamte Seite abstürzt oder weiß bleibt.
 * Stattdessen wird eine benutzerfreundliche Ersatzansicht angezeigt und der
 * Fehler technisch protokolliert.
 *
 * Einsatzgebiet:
 * Sie wird idealerweise um größere Bereiche wie das Seitenlayout, das Routing
 * oder komplexe Widgets gelegt, um die Stabilität der restlichen
 * Benutzeroberfläche sicherzustellen, auch wenn ein Teilbereich ausfällt.
 */


import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, info: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        this.setState({ error, info });
        // eslint-disable-next-line no-console
        console.error("ErrorBoundary caught:", error, info);
    }

    reset = () => this.setState({ hasError: false, error: null, info: null });

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: 20, color: "#fdd", background: "#200" }}>
                    <h2>Fehler in der Komponente</h2>
                    <pre style={{ whiteSpace: "pre-wrap", color: "#fff" }}>
                        {String(this.state.error && this.state.error.toString())}
                    </pre>
                    <details style={{ color: "#eee" }}>
                        {this.state.info && this.state.info.componentStack}
                    </details>
                    <button onClick={this.reset} style={{ marginTop: 12 }}>Reset</button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
