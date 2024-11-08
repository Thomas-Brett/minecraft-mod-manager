use reqwest::Error;
use serde::Deserialize;
use tokio::fs as async_fs;
use tokio::io::AsyncWriteExt;

#[derive(Deserialize)]
struct LoaderVersion {
    loader: Loader,
    intermediary: Intermediary,
}

#[derive(Deserialize)]
struct Loader {
    version: String,
    stable: bool,
}

#[derive(Deserialize)]
struct Intermediary {
    version: String,
}

async fn get_fabric_url(minecraft_version: &str) -> Result<Option<String>, Error> {
    let url = format!("https://meta.fabricmc.net/v2/versions/loader/{}", minecraft_version);

    let response = reqwest::get(&url).await?.json::<Vec<LoaderVersion>>().await?;

    if let Some(latest_stable) = response.iter().find(|v| v.loader.stable) {
        let loader_version = &latest_stable.loader.version;
        let download_url = format!(
            "https://meta.fabricmc.net/v2/versions/loader/{}/{}/profile/json",
            minecraft_version, loader_version
        );
        Ok(Some(download_url))
    } else {
        Ok(None)
    }
}

async fn setup_profile_directory(
    install_dir: &str,
    profile_name: &str,
    json_data: &str,
) -> std::io::Result<()> {
    let profile_dir = format!("{}\\profiles\\{}", install_dir, profile_name);
    let version_dir = format!("{}\\version", profile_dir);

    async_fs::create_dir_all(&version_dir).await?;

    let json_path = format!("{}\\{}.json", version_dir, profile_name);

    let mut file = async_fs::File::create(&json_path).await?;
    file.write_all(json_data.as_bytes()).await?;

    println!("JSON data saved at: {}", json_path);

    Ok(())
}


#[tokio::main]
pub async fn create_profile(loader: &str, profile_name: &str, version: &str, install_dir: &str) {
    match loader {
        "fabric" => create_fabric_profile(profile_name, version, install_dir).await,
        _ => println!("Loader not supported."),
    }
}

async fn create_fabric_profile(profile_name: &str, version: &str, install_dir: &str) {
    match get_fabric_url(version).await {
        Ok(Some(url)) => {
            println!("Download URL: {}", url);

            match reqwest::get(&url).await {
                Ok(response) => {
                    if let Ok(json_data) = response.text().await {
                        if let Err(e) = setup_profile_directory(install_dir, profile_name, &json_data).await {
                            eprintln!("Failed to save JSON data: {}", e);
                        }
                    } else {
                        eprintln!("Failed to retrieve JSON data.");
                    }
                }
                Err(e) => eprintln!("Failed to download JSON: {}", e),
            }
        }
        Ok(None) => println!("No stable Fabric Loader version found."),
        Err(e) => eprintln!("Error: {}", e),
    }
}