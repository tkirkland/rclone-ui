import { Button, Checkbox, Chip, Input, Select, SelectItem } from '@heroui/react'
import { disable, enable } from '@tauri-apps/plugin-autostart'
import { message } from '@tauri-apps/plugin-dialog'
import { platform } from '@tauri-apps/plugin-os'

import { EyeIcon } from 'lucide-react'
import { startTransition, useEffect, useState } from 'react'
import notify from '../../../lib/notify'
import { usePersistedStore } from '../../../store/persisted'
import BaseSection from './BaseSection'

export default function GeneralSection() {
    const settingsPass = usePersistedStore((state) => state.settingsPass)
    const setSettingsPass = usePersistedStore((state) => state.setSettingsPass)
    const [passwordInput, setPasswordInput] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false)

    const startOnBoot = usePersistedStore((state) => state.startOnBoot)
    const setStartOnBoot = usePersistedStore((state) => state.setStartOnBoot)

    const hideStartup = usePersistedStore((state) => state.hideStartup)
    const appearance = usePersistedStore((state) => state.appearance)


    useEffect(() => {
        // needed since the first value from the persisted store is undefined
        startTransition(() => {
            setPasswordInput(settingsPass || '')
        })
    }, [settingsPass])

    return (
        <BaseSection header={{ title: 'General' }}>
            <div className="flex flex-row justify-center w-full gap-8 px-8">
                <div className="flex flex-col items-end flex-1 gap-2">
                    <h3 className="font-medium">Password</h3>

                    <p className="text-xs text-neutral-500 text-end">
                        Set a password to protect this settings panel
                    </p>
                </div>

                <div className="flex flex-col w-3/5 gap-2">
                    <Input
                        placeholder="Enter password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        size="lg"
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                        type={passwordVisible ? 'text' : 'password'}
                        endContent={
                            passwordInput && (
                                <Button
                                    onPress={() => setPasswordVisible(!passwordVisible)}
                                    isIconOnly={true}
                                    variant="light"
                                    data-focus-visible="false"
                                >
                                    <EyeIcon className="w-5 h-5" />
                                </Button>
                            )
                        }
                        data-focus-visible="false"
                    />

                    <div className="flex flex-row gap-2">
                        <Button
                            size="sm"
                            fullWidth={true}
                            onPress={async () => {
                                setSettingsPass(passwordInput)
                            }}
                            data-focus-visible="false"
                        >
                            Change password
                        </Button>

                        <Button
                            size="sm"
                            color="danger"
                            fullWidth={true}
                            onPress={async () => {
                                setPasswordInput('')
                                setSettingsPass(undefined)
                            }}
                            data-focus-visible="false"
                        >
                            Remove password
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex flex-row justify-center w-full gap-8 px-8">
                <div className="flex flex-col items-end flex-1 gap-2">
                    <h3 className="font-medium">Theme</h3>
                </div>

                <div className="flex flex-col w-3/5 gap-3">
                    <Select
                        label="App Theme"
                        selectedKeys={[appearance.app]}
                        onSelectionChange={(keys) => {
                            const value = Array.from(keys)[0] as 'light' | 'dark' | 'system'
                            usePersistedStore.setState((state) => ({
                                appearance: { ...state.appearance, app: value },
                            }))
                        }}
                        size="sm"
                        data-focus-visible="false"
                    >
                        <SelectItem key="system">System</SelectItem>
                        <SelectItem key="light">Light</SelectItem>
                        <SelectItem key="dark">Dark</SelectItem>
                    </Select>

                    {platform() !== 'macos' && (
                        <Select
                            label="Tray Theme"
                            selectedKeys={[appearance.tray]}
                            onSelectionChange={(keys) => {
                                const value = Array.from(keys)[0] as 'light' | 'dark' | 'system'
                                usePersistedStore.setState((state) => ({
                                    appearance: { ...state.appearance, tray: value },
                                }))
                                notify({
                                    title: 'Tray theme updated',
                                    body: 'Restart the app to apply the changes',
                                })
                            }}
                            size="sm"
                            data-focus-visible="false"
                        >
                            <SelectItem key="system">System</SelectItem>
                            <SelectItem key="light">Light</SelectItem>
                            <SelectItem key="dark">Dark</SelectItem>
                        </Select>
                    )}
                </div>
            </div>

            <div className="flex flex-row justify-center w-full gap-8 px-8">
                <div className="flex flex-col items-end flex-grow gap-2">
                    <h3 className="font-medium">Options</h3>
                </div>

                <div className="flex flex-col w-3/5 gap-3">
                    <Checkbox
                        isSelected={startOnBoot}
                        onValueChange={async (value) => {
                            // if (!licenseValid) {
                            //     await message('Community version does not support start on boot.', {
                            //         title: 'Missing license',
                            //         kind: 'error',
                            //     })
                            //     return
                            // }

                            try {
                                setStartOnBoot(value)

                                if (value) {
                                    await enable()
                                } else {
                                    await disable()
                                }
                            } catch (error) {
                                setStartOnBoot(!value)
                                await message(
                                    `An error occurred while toggling start on boot. ${error}`,
                                    {
                                        title: 'Error',
                                        kind: 'error',
                                    }
                                )
                            }
                        }}
                    >
                        <div className="flex flex-row gap-2">
                            <p>Start on boot</p>
                            <Chip size="sm" color="primary">
                                New
                            </Chip>
                        </div>
                    </Checkbox>

                    <Checkbox
                        isSelected={!hideStartup}
                        onValueChange={(value) => {
                            usePersistedStore.setState(() => ({
                                hideStartup: !value,
                            }))
                        }}
                    >
                        <p>Show Startup screen</p>
                    </Checkbox>
                </div>
            </div>

        </BaseSection>
    )
}
