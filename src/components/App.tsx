import { Route, Switch } from "wouter-preact";
import Home from "~/src/pages/Home";
import NotFound from "~/src/pages/NotFound";

export function App() {
	return (
		<Switch>
			<Route path="/" component={Home} />
			<Route component={NotFound} />
		</Switch>
	);
}
