import { Head } from '@inertiajs/react';
import Page from './Page';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Café Universitario UTC" />
            <Page auth={auth} />
        </>
    );
}